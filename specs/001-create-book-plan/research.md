# Research & Decisions for "Physical AI & Humanoid Robotics"

This document records the rationale for key technical decisions made during the planning phase.

## 1. ROS 2 Distribution: Humble Hawksbill vs. Iron Irwini

- **Decision**: The primary ROS 2 distribution for this book will be **Humble Hawksbill**.
- **Rationale**:
    - **Long-Term Support (LTS)**: Humble is an LTS release, providing stability and support until May 2027. This is critical for a book, as it ensures the content remains relevant and functional for readers for a longer period.
    - **Maturity and Community Support**: As an LTS release, Humble has wider adoption, more stable packages, and a larger volume of community-provided solutions and tutorials.
    - **Hardware Compatibility**: Many hardware drivers and robotics platforms have stable releases targeting the LTS version.
- **Alternatives Considered**:
    - **Iron Irwini**: While newer, it is an interim release with a shorter support lifespan. It may introduce features that are not yet widely adopted or stable, which is a risk for educational content. We may include optional sections for Iron-specific features if relevant.

## 2. Simulation Engine: Gazebo vs. Unity

- **Decision**: The primary simulation engine will be **Gazebo**, with **Unity** presented as an alternative for advanced topics, particularly in Module 3.
- **Rationale**:
    - **ROS Integration**: Gazebo is the standard, officially supported simulator for ROS. The integration is seamless (`gazebo_ros_pkgs`), making it the ideal choice for teaching robotics foundations.
    - **Community and Resources**: There is a vast amount of existing ROS-based content, models, and worlds available for Gazebo.
    - **Unity for Advanced Use Cases**: Unity provides superior graphics, advanced physics, and is the foundation for NVIDIA's Isaac Sim. It will be introduced in Module 3 (NVIDIA Isaac & Perception) where its strengths are most relevant.
- **Alternatives Considered**:
    - **Unity Only**: This would create a steeper learning curve for beginners and decouple the initial learning from the standard ROS ecosystem.
    - **Other Simulators (e.g., Webots, CoppeliaSim)**: While capable, they are less standard in the ROS community than Gazebo.

## 3. Hardware Recommendations: GPU and Compute

- **Decision**: A tiered recommendation will be provided.
    - **Tier 1 (Minimum for Simulation)**: Modern CPU (Intel Core i5/AMD Ryzen 5 or newer), 16GB RAM, any dedicated GPU.
    - **Tier 2 (Recommended for NVIDIA Isaac)**: NVIDIA RTX series GPU (RTX 3060 or better) with at least 8GB of VRAM. 32GB RAM recommended.
    - **Tier 3 (For Real-World Robotics)**: NVIDIA Jetson Orin Nano/AGX for on-robot deployment, plus a host workstation meeting Tier 2 specs.
- **Rationale**: This tiered approach provides clear entry points for readers with different budgets and goals, from pure simulation to physical robot development. It explicitly calls out the necessity of an NVIDIA GPU for the Isaac module.

## 4. Book Format and Tooling: Docusaurus

- **Decision**: The book will be authored and published using **Docusaurus**.
- **Rationale**:
    - **Markdown-based (MDX)**: Allows for easy writing and the embedding of interactive React components, which is ideal for code blocks, diagrams, and simulations.
    - **GitHub Pages Deployment**: Docusaurus has excellent, out-of-the-box support for deploying to GitHub Pages via GitHub Actions, which aligns with the project's tooling architecture.
    - **Versioning and i18n**: Strong built-in features for content versioning and internationalization if needed in the future.
    - **Search**: Provides excellent, built-in search functionality which is crucial for a technical reference book.
- **Alternatives Considered**:
    - **GitBook**: A strong alternative, but Docusaurus offers more customization and is open-source.
    - **Static Site Generators (e.g., Hugo, Jekyll)**: While fast, they lack the rich ecosystem of React components that Docusaurus (via MDX) provides.
