import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
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

    const { messageId, recipientEmail, replySubject, replyMessage } = body || {};

    if (!messageId || !recipientEmail || !replySubject || !replyMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "All fields (messageId, recipientEmail, replySubject, replyMessage) are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables in reply-contact Edge Function");
      return new Response(
        JSON.stringify({ success: false, message: "Internal server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Outbound email dispatch via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Manvith S Shetty <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: replySubject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #090d16; color: #f8fafc;">
              <h2 style="color: #38bdf8; margin-top: 0;">Response to Your Message</h2>
              <hr style="border: 0; border-top: 1px solid #1e293b; margin: 16px 0;" />
              <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap;">
                ${replyMessage}
              </div>
              <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0 16px 0;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">This message was sent by Manvith S Shetty via Portfolio CMS.</p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend API error response:", errText);
        return new Response(
          JSON.stringify({ success: false, message: `Failed to deliver email: ${errText}` }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    } else {
      console.log("RESEND_API_KEY environment secret not set; simulated email reply.");
    }

    // Automatically update message status to 'replied' in Supabase DB
    const { error: dbError } = await supabase
      .from("messages")
      .update({ status: "replied", updated_at: new Date().toISOString() })
      .eq("id", messageId);

    if (dbError) {
      console.error("Failed to update message status to replied:", dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reply delivered and status updated to replied successfully.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    console.error("Unhandled error in reply-contact Edge Function:", err);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
