import { supabase } from "@/config/supabase";
import {
  ContactSubmissionPayload,
  ContactSubmissionResponse,
  ContactMessageDTO,
  ContactMessagesResponse,
  MessageStatus,
  ReplyPayload,
  ReplyResponse,
} from "../types/contact.types";

const FUNCTIONS_URL =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
  (import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : "https://placeholder.supabase.co/functions/v1");

export const contactApi = {
  /**
   * Submit visitor contact message via Supabase Edge Function.
   * Per flow rules, public submission must NEVER call `supabase.from()` directly.
   */
  async submitMessage(payload: ContactSubmissionPayload): Promise<ContactSubmissionResponse> {
    const response = await fetch(`${FUNCTIONS_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit contact message");
    }

    return result;
  },

  /**
   * Send admin reply to visitor message via Edge Function + Resend.
   */
  async replyToMessage(payload: ReplyPayload): Promise<ReplyResponse> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(`${FUNCTIONS_URL}/reply-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send reply email");
    }

    return result;
  },

  /**
   * Fetch messages for Admin CMS inbox with status filtering, search, and pagination.
   */
  async getMessages(params: {
    status?: MessageStatus | "all";
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ContactMessagesResponse> {
    const { status = "all", search = "", page = 1, pageSize = 10 } = params;

    let query = supabase.from("messages").select("*", { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `name.ilike.${term},email.ilike.${term},subject.ilike.${term},message.ilike.${term}`,
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const mapped: ContactMessageDTO[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status as MessageStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      data: mapped,
      totalCount: count || 0,
    };
  },

  /**
   * Update message status in database (e.g. read, replied, archived, unread).
   */
  async updateMessageStatus(id: string, status: MessageStatus): Promise<void> {
    const { error } = await supabase.from("messages").update({ status }).eq("id", id);
    if (error) throw error;
  },

  /**
   * Delete message permanently from database.
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
  },
};
