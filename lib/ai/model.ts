import { anthropic } from "@ai-sdk/anthropic";

/** Default Anthropic model for parsing, categorization, and chat. */
export const CLAUDE_MODEL_ID = "claude-sonnet-4-6";

export const claudeModel = anthropic(CLAUDE_MODEL_ID);
