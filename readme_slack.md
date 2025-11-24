# Messenger Simulator (Slack-like) Documentation

This document describes the implementation details, styling rules, and logic for the Messenger Simulator used in Lesson 4.

## 1. Visual Design (CSS)

The messenger is designed to mimic the Slack interface.

### Layout
- **Container**: `.messenger-layout`
- **Dimensions**: Fixed size **900px width x 600px height**.
- **Positioning**: Centered on screen, no resizing when switching chats.
- **Overflow**: Hidden to prevent scrollbars on the main container.

### Sidebar
- **Theme**: Dark Purple (`#3F0E40`).
- **Text Color**: White / Light Gray (`#B8B8B8` for inactive).
- **Avatars**: 24px x 24px, rounded corners.
- **Unread Indicator**: Bold text + White dot (`.unread-dot`).
- **Sorting**: Contacts sort dynamically (most recent message at top).

### Chat Window
- **Header**: Shows contact name, role, and avatar.
- **Message Style**:
    - **Block Layout**: Avatar on left, Name & Time on top, Text below.
    - **No Bubbles**: Text is plain, aligned left.
    - **Avatars**: All messages (including player) have avatars.
- **Input Area**: Fixed at bottom, contains choice buttons.

## 2. Data Structure (`messenger-scenarios.json`)

### Contacts
Defined in the `contacts` array.
```json
{
    "id": "dev-team",
    "name": "#dev-team",
    "role": "Dev Team Channel",
    "avatar": "assets/images/scenes/...",
    "status": "online",
    "isChannel": true
}
```

### Scenarios
Defined in the `scenarios` array.
- **triggerTime**: Game time (e.g., "09:00") - used for display/fallback.
- **triggerRealTime**: **Real seconds** from start (e.g., `2`, `4`, `105`) - used for precise triggering.
- **contactId**: ID of the chat where the message appears.
- **messages**: Array of message objects.

```json
{
    "id": "msg_1",
    "triggerTime": "09:00",
    "triggerRealTime": 2,
    "contactId": "general",
    "messages": [
        {
            "sender": "player", 
            "text": "Message text..."
        }
    ]
}
```

## 3. Logic & Rules (`messenger-game.js`)

### Timing
- **Ratio**: 1 real second = 4 game seconds.
- **Triggering**: The game loop checks `elapsedRealTime` against `scenario.triggerRealTime`.

### Sender Resolution
To ensure messages in channels (like #general or #dev-team) show the correct sender:
1.  **Player**: `sender: "player"` -> Shows "Alex" + Player Avatar.
2.  **System**: `sender: "System"` -> Shows "System" + System Icon (SVG).
3.  **Specific Contact**: `sender: "igor"` -> Looks up "igor" in `contacts` list to find Name & Avatar.
4.  **Fallback (Lena)**: `sender: "lena"` -> Hardcoded fallback if Lena is not in contacts list.

### Unread Status
- New messages mark a contact as `unread`.
- Opening a chat clears the `unread` status.
- Unread contacts are bolded in the sidebar.

## 4. Assets
- **Avatars**: Located in `assets/images/characters/`.
- **Channel Icons**: Located in `assets/images/scenes/`.
- **System Icon**: Embedded SVG in `messenger-game.js`.

## 5. Mobile Responsiveness

The messenger supports mobile devices (screens < 768px).

### Layout
- **Breakpoint**: 768px.
- **Dimensions**: Switches to **100% width and 100vh height**.
- **Structure**: Stacked layout where only one view (Sidebar or Chat) is visible at a time.

### Navigation Logic
- **Default State**: Shows **Contact List** (`.messenger-sidebar`), hides Chat.
- **Active Chat**:
    - Adding `.show-chat` class to `.messenger-layout` hides Sidebar and shows Chat.
    - Triggered by clicking a contact.
- **Back Button**:
    - Visible only on mobile in the Chat Header.
    - Clicking it calls `backToContacts()`, which removes `.show-chat`.
    - Returns user to the Contact List.
