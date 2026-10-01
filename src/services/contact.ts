import { FUNCTIONS_URL } from "../lib/spabase";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactRequest) {
  const response = await fetch(`${FUNCTIONS_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}
