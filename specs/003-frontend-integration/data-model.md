# Data Model: Frontend State for Backend Services Integration

This document describes the key data structures and state models that will be managed in the Docusaurus frontend to interact with the backend services.

## 1. Authentication State

This state will manage the user's login status and related information. It will likely be stored in a React Context Provider.

-   **`isAuthenticated`**: `boolean`. True if a user is logged in, false otherwise.
-   **`authToken`**: `string` or `null`. The JWT received from the backend upon successful login. Stored securely (e.g., in `localStorage` or `sessionStorage` for persistence).
-   **`userProfile`**: `object` or `null`. Contains `id`, `email`, `software_background`, `hardware_background` (from backend's `users` table).
-   **`isLoading`**: `boolean`. True while an authentication API call is in progress.
-   **`error`**: `string` or `null`. Stores any error message from authentication attempts.

## 2. Chatbot State

This state will manage the chatbot's UI and interaction.

-   **`isOpen`**: `boolean`. True if the chatbot widget is open, false if minimized.
-   **`messages`**: `array of objects`. Stores the conversation history.
    -   Each message object: `{ type: 'user' | 'bot', text: string, sources?: array }`
-   **`currentQuestion`**: `string`. The text currently being typed by the user.
-   **`isTyping`**: `boolean`. True if the chatbot is generating a response.
-   **`error`**: `string` or `null`. Stores any error message from chat API calls.
-   **`context`**: `string` or `null`. Stores user-selected text for contextual questions.

## 3. Translation State

This state will manage the display of translated content.

-   **`isTranslated`**: `boolean`. True if the current chapter is displaying translated text.
-   **`originalContent`**: `string` or `null`. Stores the original text of the chapter before translation.
-   **`translatedContent`**: `string` or `null`. Stores the Urdu translation of the chapter.
-   **`isLoading`**: `boolean`. True while translation API call is in progress.
-   **`error`**: `string` or `null`. Stores any error message from translation attempts.

## 4. User Profile State (for profile page)

This state specifically manages the data displayed on the user's profile page. It would typically be part of `Authentication State` but separated for UI clarity.

-   **`softwareBackground`**: `object`. User's self-reported software skills.
-   **`hardwareBackground`**: `object`. User's self-reported hardware skills.
-   **`isLoading`**: `boolean`. True while fetching profile data.
-   **`error`**: `string` or `null`. Stores any error message from profile data fetch.
```
