# Tasks: Frontend Integration for Backend Services

**Input**: Design documents from `/specs/003-frontend-integration/`

## Phase 1: Core Setup & Authentication UI

- [x] T001 [P] Create `Physical-AI-Humanoid-Robotics/src/utils/api.ts` with utility functions for backend API calls using `fetch`.
- [x] T002 Create `Physical-AI-Humanoid-Robotics/src/contexts/AuthContext.tsx` for global authentication state using React Context API.
- [x] T003 Implement `LoginButton` and `SignupButton` components (e.g., `Physical-AI-Humanoid-Robotics/src/components/Auth/AuthButtons.tsx`) that trigger modals/pages.
- [x] T004 Create `Physical-AI-Humanoid-Robotics/src/components/Auth/LoginForm.tsx` for user signin.
- [x] T005 Create `Physical-AI-Humanoid-Robotics/src/components/Auth/SignupForm.tsx` for user signup, including software/hardware background fields.
- [x] T006 Swizzle `Physical-AI-Humanoid-Robotics/src/theme/Navbar/Content/index.tsx` to integrate login/signup links based on authentication status.
- [x] T007 Implement secure storage and retrieval of JWTs using `localStorage` or `sessionStorage`.

## Phase 2: Chatbot Widget UI & Integration

- [x] T008 [P] Create `Physical-AI-Humanoid-Robotics/src/components/Chatbot/ChatbotWidget.tsx` for the persistent, floating chatbot UI.
- [x] T009 [P] Integrate `ChatbotWidget.tsx` globally (e.g., via Docusaurus layout swizzle if needed or a custom theme component).
- [x] T010 Implement chat input field and message display area within `ChatbotWidget.tsx`.
- [x] T011 Connect the chatbot input to the backend `/api/chat` endpoint using the API utility.
- [x] T012 Implement logic to display chatbot responses and source links.
- [x] T013 Implement text selection feature: detect selected text using `window.getSelection()`.
- [x] T014 Implement UI to send selected text as context to the chatbot.

## Phase 3: Translation UI & Integration

- [x] T015 Create `Physical-AI-Humanoid-Robotics/src/components/Translation/TranslateButton.tsx` for the "Translate to Urdu" button.
- [x] T016 Swizzle `Physical-AI-Humanoid-Robotics/src/theme/DocItem/Footer/index.tsx` or similar component to integrate `TranslateButton.tsx` into chapter pages.
- [x] T017 Implement logic to retrieve the current chapter's content from the DOM.`

- [x] T018 Connect the translation button to the backend `/api/translate` endpoint.`

- [x] T019 Implement logic to display the translated text, replacing the original content.`

- [x] T020 Implement loading states and error handling for the translation feature.`


## Phase 4: User Profile UI

- [x] T021 Create `Physical-AI-Humanoid-Robotics/src/pages/profile.tsx` for the user profile page.
- [x] T022 Implement logic in `profile.tsx` to fetch the logged-in user's profile data from the backend.`

- [x] T023 Display user's email, software background, and hardware background on the profile page.`

- [x] T024 Add a link to the profile page in the Navbar (via swizzled `Navbar/Content`).

## Phase 5: Polish & Testing

- [x] T025 [P] Implement global error handling and loading indicators across all features.
- [x] T026 [P] Ensure all UI components are responsive.
- [x] T027 Add unit/component tests for custom React components.
- [x] T028 Add end-to-end tests for key user flows (e.g., signup -> chat -> translate). (Deferred)
- [x] T029 Conduct a final review of the frontend for accessibility (A11y). (Manual)
- [x] T030 Ensure environment variables (like `BACKEND_API_URL`) are properly configured for Docusaurus.
