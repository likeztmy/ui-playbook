---
tags: [boundary]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
---

The settings page of a team workspace, with these sections:

- **Profile**: Name, Email, Avatar (upload or remove).
- **Notifications**: email me about Mentions, Assigned to me, Weekly digest (each on or off), and a Digest day (Monday to Friday).
- **Appearance**: Theme (Light, Dark, System).
- **Region**: Time zone and Date format.
- **Members**: the people in the workspace (name, email, role) and an Invite button.
- At the end, **Delete workspace**.

Write it as a React + TypeScript component in `Settings.tsx`, with its styles in `Settings.module.css` (a CSS module). Invent realistic sample data. Those two files are all I need; don't set up a project around them.
