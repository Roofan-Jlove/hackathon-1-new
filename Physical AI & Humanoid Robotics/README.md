# Physical AI & Humanoid Robotics Book

This is the official repository for the "Physical AI & Humanoid Robotics" book, built using Docusaurus. This book explores modern robotics concepts, simulation with Gazebo and NVIDIA Isaac Sim, and cutting-edge Vision-Language-Action (VLA) pipelines, all within a Spec-Driven Development framework.

## Getting Started

To get a local copy of the book up and running, follow these steps.

### Prerequisites

You will need Node.js (version >= 20.0) and npm installed. Yarn is also commonly used for Docusaurus projects.

*   **Node.js & npm**: [https://nodejs.org/](https://nodejs.org/)
*   **Yarn (Optional but recommended)**: `npm install --global yarn`

For detailed environment setup, including ROS 2 and simulation tools, please refer to the [Quickstart Guide](./quickstart.md).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Roofan-Jlove/hackathon-1-new.git
    cd hackathon-1-new
    ```
2.  **Navigate to the book's directory:**
    ```bash
    cd "Physical AI & Humanoid Robotics"
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or if you prefer yarn:
    # yarn install
    ```

## Running the Book Locally (Development)

To run the book in a local development server with live reloading:

```bash
cd "Physical AI & Humanoid Robotics"
npm start
# or:
# yarn start
```
This command starts a local development server and automatically opens a browser window. Most changes you make to the `.mdx` content will reflect live without restarting the server. You can access the book at `http://localhost:3000`.

## Building the Book (Production)


RUN CAMMAND on LOCAL:

node .\node_modules\@docusaurus\core\bin\docusaurus.mjs start


To generate static content for production deployment:

```bash
cd "Physical AI & Humanoid Robotics"
npm run build
# or:
# yarn build
```
This command generates static HTML, CSS, and JavaScript files into the `build` directory. This static content can then be served using any static hosting service (e.g., GitHub Pages).

## Deployment to GitHub Pages

This project is configured to deploy automatically to GitHub Pages via GitHub Actions.
Any push to the `main` branch will trigger the deployment workflow located in `.github/workflows/deploy.yml`.

## Project Structure (Key Files)

*   `docs/`: Contains all the book's content, organized by modules and weeks.
*   `docusaurus.config.ts`: Main Docusaurus configuration file.
*   `sidebars.ts`: Defines the navigation structure of the book.
*   `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment.
