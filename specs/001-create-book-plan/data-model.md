# Data Model: Book Content Structure

This document defines the hierarchical structure of the book's content.

## 1. Book

The root entity representing the entire work, "Physical AI & Humanoid Robotics".

- **Attributes**:
    - `title`: The official title of the book.
    - `author`: The authoring team.
    - `version`: The book's edition number.

## 2. Module

A high-level section of the book, equivalent to a "Part". There are 4 core modules.

- **Attributes**:
    - `title`: The title of the module (e.g., "Module 1: ROS 2 & Robotics Foundations").
    - `summary`: A paragraph describing the module's learning objectives.
- **Relationships**:
    - A `Book` has many `Modules`.
    - A `Module` has many `Weeks`.

## 3. Week

A weekly breakdown of content within a module.

- **Attributes**:
    - `title`: The title for the week's topic (e.g., "Week 1: Introduction to ROS 2").
    - `learning_outcomes`: A list of skills and concepts the reader will learn.
- **Relationships**:
    - A `Module` has many `Weeks`.
    - A `Week` has many content blocks (`Chapter`, `Lab`, etc.).

## 4. Content Blocks

These are the individual pieces of content that make up a `Week`.

- **Chapter**: A text-based section explaining concepts.
- **Lab**: A hands-on tutorial with step-by-step instructions.
- **Code Block**: A formatted snippet of code with explanations.
- **Diagram**: A visual graphic, such as an architecture diagram.
- **Hardware Instructions**: Specific steps for interacting with physical hardware (e.g., Jetson Orin, Humanoid Robots).

## 5. Appendices

A collection of supplementary materials at the end of the book.

- **Types**:
    - `Cheatsheets`: Quick reference guides.
    - `References`: A list of all cited sources.
    - `Glossary`: Definitions of key terms.
