# Implementation Plan: Frontend Integration for Backend Services

**Branch**: `003-frontend-integration` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-integration/spec.md`

## Summary

This plan outlines the technical implementation for integrating the Docusaurus frontend with the backend services. It covers UI design for the RAG chatbot, user authentication and profiling, and content translation, along with communication strategies, Docusaurus integration approaches, and a phased workflow for development.

## Technical Context

**Language/Version**: TypeScript, React 19+, Docusaurus v3.
**Primary Dependencies**: Native `fetch` API, React Context API.
**Storage**: Browser `localStorage`/`sessionStorage` for auth tokens.
**Testing**: Jest/React Testing Library for unit/component tests, Playwright/Cypress for E2E tests.
**Target Platform**: Web browser.
**Project Type**: Frontend application.
**Performance Goals**: UI updates within 500ms, API calls displayed within 3 seconds, chatbot response displayed within 5 seconds of backend response.
**Constraints**: Must integrate seamlessly with existing Docusaurus structure and theme. Backend API must be accessible and functional.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Technical Accuracy**: The plan relies on standard web technologies (React, fetch) and Docusaurus integration patterns.
- [x] **Clarity and Accessibility**: The plan is broken down into clear phases and defines UI/UX for each feature.
- [x] **Consistency**: Adheres to Docusaurus best practices for component integration and theming.
- [x] **Practicality**: The use of native browser APIs and React Context keeps the solution lightweight and implementable.
- [x] **Traceability**: Decisions are clearly linked to specification requirements and design choices in this plan.

## Project Structure

### Documentation (this feature)

The following artifacts have been generated for this plan:
```text
specs/003-frontend-integration/
├── plan.md              # This file
├── research.md          # Documents key technical decisions
├── data-model.md        # Defines frontend state models
├── quickstart.md        # Provides frontend setup instructions
└── contracts/README.md  # Explains backend contract consumption
```

### Source Code (Physical-AI-Humanoid-Robotics/)

New React components will be created within the existing Docusaurus project structure.

```text
Physical-AI-Humanoid-Robotics/
├── src/components/                # New custom React components
│   ├── Auth/                      # Login, Signup, Profile forms/pages
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProfilePage.tsx
│   ├── Chatbot/                   # Chatbot widget and interface
│   │   └── ChatbotWidget.tsx
│   ├── Translation/               # Translation button/display
│   │   └── TranslateButton.tsx
│   └── ApiClient/                 # API utility functions
│       └── useApi.ts              # Custom hook for API calls
├── src/theme/                     # Docusaurus swizzled components
│   ├── Navbar/                    # For Login/Signup links
│   │   └── Content/index.tsx
│   └── DocItem/                   # For translation button
│       └── Footer/index.tsx
├── src/contexts/                  # React Contexts for global state
│   └── AuthContext.tsx
├── src/pages/                     # New custom pages (e.g., profile page)
│   └── profile.tsx
└── docusaurus.config.ts           # Configuration for new pages/plugins
```

**Structure Decision**: Custom React components will be housed in `src/components/`, organized by feature. Docusaurus theme components will be selectively swizzled for global UI changes (e.g., Navbar links). Global state will be managed with React Context.

## UI Components Design

### 1. Chatbot Widget
-   **Layout**: Floating, collapsible widget, typically positioned in the bottom-right corner of the screen.
-   **Chat Interface**: Displays conversation history (user questions, bot answers, source links). Includes a text input field and a send button.
-   **Contextual Question**: When text is selected on a page, a small pop-up or context menu option will appear to "Ask Chatbot" which will pass the selected text as context.

### 2. User Authentication Forms/Pages
-   **Login Form**: Modal or dedicated page (`/login`) with fields for email and password.
-   **Signup Form**: Modal or dedicated page (`/signup`) with fields for email, password, and a dynamic questionnaire for software/hardware background.
-   **User Feedback**: Clear loading states, success messages, and validation/error messages.

### 3. Translation Button & Display
-   **Button Placement**: A prominent "Translate to Urdu" button (or similar icon) located at the top of each chapter content page, visible only to logged-in users.
-   **Display**: Clicking the button will toggle the display of the chapter content between original English and translated Urdu text. A loading indicator will be shown during translation.

### 4. User Profile Page
-   **Dedicated Page**: `/profile` page showing the logged-in user's email, software background, and hardware background.
-   **Edit Functionality**: (Future enhancement) Option to edit background information.

## Frontend-Backend Communication Strategy

-   **API Client**: A custom utility (e.g., `src/utils/api.ts`) will wrap native `fetch` API calls.
-   **Authentication Tokens**: JWTs received from the backend upon successful login/signup will be stored securely in `localStorage` or `sessionStorage`. All subsequent authenticated API requests will include this JWT in the `Authorization: Bearer <token>` header.
-   **Error Handling**: A global mechanism (e.g., React Error Boundary or centralized `useApi` hook) to catch API errors, display user-friendly messages, and log technical details.
-   **Loading States**: Visual feedback (spinners, disabled buttons) will be provided for all ongoing API requests.

## Docusaurus Integration Approach

-   **Global UI (Navbar)**: Login/Signup links in the Docusaurus Navbar will likely require [swizzling](https://docusaurus.io/docs/next/swizzling) the `NavbarItem` component or a similar mechanism to conditionally display based on authentication status.
-   **Contextual UI (DocItem Footer/Content)**: The translation button will be integrated into the `DocItem` component (via swizzling or custom `DocItem` layout). Text highlighting for chatbot context will involve DOM manipulation within the content area.
-   **Custom Pages**: User profile page (`/profile`) will be a standard React component within `src/pages/`.
-   **MDX Integration**: Custom React components (e.g., for chatbot widget) can be imported and used directly within `.mdx` content.

## Phased Workflow

1.  **Phase 1**: Core Setup & Authentication UI
    -   Global Auth Context (`AuthContext.tsx`).
    -   API utility (`src/utils/api.ts`) for backend communication.
    -   Login (`LoginForm.tsx`) and Signup (`SignupForm.tsx`) forms/modals.
    -   Integrate Auth UI into Navbar (swizzle `NavbarItem`).
    -   Create `/profile` page with placeholder content.
2.  **Phase 2**: Chatbot Widget UI & Integration
    -   Create Chatbot Widget component (`ChatbotWidget.tsx`).
    -   Integrate widget globally (e.g., via Docusaurus layout swizzle).
    -   Implement chat interface (text input, message display).
    -   Connect to `/api/chat` endpoint.
    -   Implement text selection for contextual questions.
3.  **Phase 3**: Translation UI & Integration
    -   Implement "Translate to Urdu" button (`TranslateButton.tsx`).
    -   Integrate button into chapter pages (swizzle `DocItem`).
    -   Implement logic to fetch chapter content and send to `/api/translate`.
    -   Display translated text.
4.  **Phase 4**: User Profile UI & Personalization
    -   Populate `/profile` page with user's background data.
    -   Allow editing of background (future enhancement).
5.  **Phase 5**: Polish & Testing
    -   Add loading states and error handling across all features.
    -   Implement frontend unit and E2E tests.
    -   Ensure UI is responsive and accessible.
