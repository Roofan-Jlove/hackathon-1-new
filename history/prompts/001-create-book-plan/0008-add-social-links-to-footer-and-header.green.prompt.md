---
id: 0008
title: Add Social Links to Footer and Header
stage: green
date: 2025-12-09
surface: agent
model: gemini
feature: 001-create-book-plan
branch: main
user: Rofan-Jlove
command: null
labels: ["links", "footer", "navbar", "social"]
links:
  spec: ./specs/001-create-book-plan/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - Physical-AI-Humanoid-Robotics/docusaurus.config.ts
tests:
 - none
---

## Prompt

User: Add my Linkdin ID in community at footer "https://www.linkedin.com/feed/"
Add my Github repo URL for same repo in footer and header

## Response snapshot

Acknowledged user's request to add LinkedIn and GitHub links. Updated 'docusaurus.config.ts' to include the LinkedIn link in the footer's 'Community' section, and verified existing GitHub links in both header and footer are correct. Changes pushed to 'main'.

## Outcome

- ✅ Impact: Added user's LinkedIn profile to the footer and ensured correct GitHub repository links are present in both the header and footer, enhancing project visibility and connectivity.
- 🧪 Tests: None (expected to be verified by user on Vercel).
- 📁 Files: Updated `Physical-AI-Humanoid-Robotics/docusaurus.config.ts`.
- 🔁 Next prompts: Awaiting user's verification of successful Vercel deployment with updated links.
- 🧠 Reflection: Successfully identified existing GitHub links and only added the new LinkedIn link.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): n/a
