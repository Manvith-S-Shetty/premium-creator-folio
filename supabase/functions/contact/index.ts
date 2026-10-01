import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Disposable Email Domain Blocklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "trashmail.com",
  "yopmail.com",
  "dispostable.com",
  "getnada.com",
  "sharklasers.com",
  "maildrop.cc",
]);

// In-Memory Rate Limiting: Max 5 submissions per IP every 10 minutes (600,000 ms)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

Deno.serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Reject non-POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";

    // Enforce Rate Limiting
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Too many contact submissions. Please try again in 10 minutes.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid JSON request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { name, email, subject, message, website } = body || {};

    // 1. Honeypot check: If hidden field 'website' is filled out, silently drop spam
    if (website && String(website).trim().length > 0) {
      console.log(`[SPAM DETECTED] Honeypot triggered by IP: ${clientIp}`);
      return new Response(JSON.stringify({ success: true, message: "Message sent successfully" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields (name, email, subject, message) are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Email Format & Disposable Check
    if (typeof email !== "string" || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email address format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (isDisposableEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Disposable email domains are not allowed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4. Message Length Check (min 10 chars)
    if (typeof message !== "string" || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ success: false, message: "Message must be at least 10 characters long" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const cleanName = sanitizeInput(String(name));
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanSubject = sanitizeInput(String(subject));
    const cleanMessage = sanitizeInput(String(message));
    const submissionTime = new Date().toUTCString();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables in Edge Function");
      return new Response(
        JSON.stringify({ success: false, message: "Internal server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to Database
    const { data: insertedData, error: dbError } = await supabase
      .from("messages")
      .insert([
        {
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          status: "unread",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to save message to database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Send Notification Email via Resend if API Key exists
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "manumanvith06@gmail.com";

    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `[Portfolio Contact] ${cleanSubject}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px; padding: 24px; background: #090d16; color: #f8fafc;">
                <h2 style="color: #38bdf8; margin-top: 0;">New Portfolio Message Received</h2>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 16px 0;" />
                <p style="font-size: 14px;"><strong>Visitor Name:</strong> ${cleanName}</p>
                <p style="font-size: 14px;"><strong>Visitor Email:</strong> <a href="mailto:${cleanEmail}" style="color: #38bdf8;">${cleanEmail}</a></p>
                <p style="font-size: 14px;"><strong>Subject:</strong> ${cleanSubject}</p>
                <p style="font-size: 14px;"><strong>Submitted At:</strong> ${submissionTime}</p>
                <p style="font-size: 14px; margin-top: 20px;"><strong>Message:</strong></p>
                <div style="background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #cbd5e1;">
                  ${cleanMessage}
                </div>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0 16px 0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Sent securely via Portfolio Supabase Edge Function & Resend SMTP</p>
              </div>
            `,
          }),
        });

        if (!resendRes.ok) {
          const resendErr = await resendRes.text();
          console.error("Resend notification error response:", resendErr);
        }
      } catch (emailErr) {
        console.error("Failed to send Resend email notification:", emailErr);
      }
    } else {
      console.log("RESEND_API_KEY environment secret not set; skipped notification dispatch.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
        data: { id: insertedData?.id },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    console.error("Unhandled error in contact Edge Function:", err);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
