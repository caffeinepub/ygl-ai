# YGL AI

## Current State
New project. Only scaffold files exist.

## Requested Changes (Diff)

### Add
- Full ChatGPT-like chat interface with dark mode
- Sidebar with New Chat, Clear Chat, Settings actions
- Chat message bubbles: user on right, AI on left
- Typing indicator (AI is thinking...)
- Auto-scroll to latest message
- Copy response button per AI message
- Settings panel (model selection placeholder)
- HTTP outcalls to call AI API (Google Gemini)
- Backend stores chat history per session (anonymous)
- API key stored securely in backend config

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select http-outcalls component for backend AI API calls
2. Generate Motoko backend:
   - Store chat messages (role + content) in stable memory
   - HTTP outcall to Gemini API to get AI response
   - Endpoints: sendMessage(text) -> AI response text, getHistory() -> messages, clearHistory()
3. Build React frontend:
   - Dark themed layout with sidebar
   - Chat window with message bubbles
   - Typing indicator
   - Auto-scroll
   - Copy button per message
   - Settings modal
