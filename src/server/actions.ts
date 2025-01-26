"use server";

import { fetchEvents } from "./googleCalendar";
import { fetchTimeFromEmail, replyWithAI } from "./modelProcessing";

export interface ReplyWithAIResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

export async function replyWithAIAction(
  title: string,
  sender: string,
  content: string,
  aiPrompt: string,
): Promise<ReplyWithAIResponse> {
  try {
    const aiResponse = await replyWithAI(title, sender, content, aiPrompt);

    if (aiResponse?.reply) {
      return { success: true, reply: aiResponse.reply };
    } else {
      console.error(
        "AI response does not contain a 'reply' field:",
        aiResponse,
      );
      return {
        success: false,
        error: "AI reply generation failed.",
      };
    }
  } catch (error) {
    console.error("Error generating AI reply:", error);
    return {
      success: false,
      error: "Failed to generate reply",
    };
  }
}

export async function scheduleWithAIAction(
  id: string,
  title: string,
  sender: string,
  content: string,
  timestamp: string,
) {
  const busyEvents = await fetchEvents();
  const suggestedEvent = await fetchTimeFromEmail(
    { id, title, sender, content, timestamp },
    busyEvents,
  );

  return suggestedEvent;
}
