---
tags: [boundary,layout]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
---

The details panel beside an open issue in an issue tracker. A Properties section: status, priority, assignee, labels, due date, created and updated, with a way to edit them. A Linked issues section listing three related issues, with a way to add one.

Write it as a React + TypeScript component in `DetailsPanel.tsx`, with its styles in `DetailsPanel.module.css` (a CSS module). Invent realistic sample data. Those two files are all I need; don't set up a project around them.
