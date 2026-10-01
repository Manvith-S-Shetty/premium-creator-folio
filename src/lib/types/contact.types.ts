import { PersonalInfoDTO } from "./cms.types";

export type ContactSubmissionPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // Honeypot field
};

export type ContactSubmissionResponse = {
  success: boolean;
  message: string;
  data?: { id: string };
};

export type ReplyPayload = {
  messageId: string;
  recipientEmail: string;
  replySubject: string;
  replyMessage: string;
};

export type ReplyResponse = {
  success: boolean;
  message: string;
};

export type MessageStatus = "unread" | "read" | "replied" | "archived";

export type ContactMessageDTO = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessagesResponse = {
  data: ContactMessageDTO[];
  totalCount: number;
};
