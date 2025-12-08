# Quickstart: Setting Up Your Environment

This guide provides the essential steps to set up your local environment for both reading the book and following along with the exercises.

## 1. System Requirements

Before you begin, ensure your system meets the **Tier 1 (Minimum for Simulation)** requirements outlined in `research.md`:
- **CPU**: Modern Intel Core i5 / AMD Ryzen 5 or newer
- **RAM**: 16GB or more
- **GPU**: Any dedicated GPU
- **OS**: Ubuntu 22.04 (Jammy Jellyfish) is the primary supported OS for ROS 2 Humble.

**Note**: For later modules involving NVIDIA Isaac Sim, a more powerful machine with an NVIDIA RTX GPU is required. See the `research.md` for details.

## 2. Core Software Installation

### ROS 2 Humble

Follow the official ROS 2 documentation to install **ROS 2 Humble Hawksbill**:
- [Ubuntu (Debian packages)](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debians.html)

After installation, ensure you have sourced the setup file correctly and that the `colcon` build tool is installed:
```bash
# Source ROS 2
source /opt/ros/humble/setup.bash

# Install colcon
sudo apt install python3-colcon-common-extensions
```

### Gazebo Simulator

Gazebo is installed as part of the `ros-humble-desktop` installation. You can verify it by running:
```bash
gazebo --version
```

### Git

You will need Git to clone the book's repository and manage your own code.
```bash
sudo apt install git
```

## 3. Project Setup

### Cloning the Repository

Clone the book's source code repository from GitHub.
```bash
git clone <repository-url>
cd <repository-name>
```

### Docusaurus (for viewing the book locally)

The book is built with Docusaurus. To view it locally, you need to have Node.js and `yarn` installed.

1.  **Install Node.js and npm**:
    ```bash
    sudo apt install nodejs npm
    ```
2.  **Install Yarn**:
    ```bash
    npm install --global yarn
    ```
3.  **Install Project Dependencies**:
    Navigate to the cloned repository directory and run:
    ```bash
    yarn install
    ```
4.  **Run the Development Server**:
    ```bash
    yarn start
    ```
    This will open a browser window at `http://localhost:3000` where you can view the book.

## 4. Next Steps

With your environment set up, you are ready to begin with Module 1. As you progress, individual modules may have additional setup steps (e.g., installing specific ROS packages or configuring NVIDIA Isaac Sim). These will be detailed at the beginning of each relevant section.
