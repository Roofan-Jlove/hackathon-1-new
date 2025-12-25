# Quickstart: Frontend Integration Setup

This guide provides the essential steps to set up your local development environment for working on the Docusaurus frontend integration with backend services.

## 1. Prerequisites

-   Ensure your backend services are running locally (refer to `specs/002-chatbot-backend/quickstart.md` for instructions).
-   Node.js (version >= 20.0) and npm/yarn installed.

## 2. Setup

1.  **Navigate to the Docusaurus project directory:**
    ```bash
    cd Physical-AI-Humanoid-Robotics
    ```

2.  **Install frontend dependencies (if not already done):**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure Backend API URL:**
    The frontend will need to know where your backend API is running.
    *   For local development, the backend is typically at `http://localhost:8000/api`.
    *   For production deployments, this will be your Vercel deployment URL (e.g., `https://your-vercel-domain.vercel.app/api`).
    You will likely set this as an environment variable (`process.env.BACKEND_API_URL`) that Docusaurus can pick up. You may need to create a `.env` file in the `Physical-AI-Humanoid-Robotics` directory:
    ```env
    BACKEND_API_URL=http://localhost:8000/api
    ```
    And configure Docusaurus to load `.env` variables if it doesn't do so by default (this often requires Docusaurus configuration or using a package like `dotenv`).

## 3. Running the Frontend Locally

1.  **Start the Docusaurus development server:**
    ```bash
    npm start
    # or yarn start
    ```
    This will open the book in your browser, typically at `http://localhost:3000`. Your frontend changes will hot-reload.

## 4. Key Frontend Files to Modify

You will primarily be working in the `Physical-AI-Humanoid-Robotics` directory. Key files for this integration include:

-   `src/theme/Navbar/Content/index.tsx`: For login/signup links. (Potentially needs swizzling)
-   `src/theme/DocItem/Footer/index.tsx`: For translation button. (Potentially needs swizzling)
-   `src/components/`: For custom React components (chatbot widget, auth forms, profile page).
-   `src/pages/index.tsx`: For the homepage.
-   `src/utils/api.ts`: A new file for API utility functions (`fetch` wrappers).
-   `docusaurus.config.ts`: For any Docusaurus-specific configuration for new pages or plugins.
```
