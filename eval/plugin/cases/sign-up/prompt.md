---
tags: [forms]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
---

A sign-up form for a web app: name, email, password (at least 8 characters) and a checkbox to accept the terms, then a button to create the account. It should validate what people enter and tell them what's wrong.

Write it as a React + TypeScript component in `SignUp.tsx`, with its styles in `SignUp.module.css` (a CSS module). Invent realistic sample data. Those two files are all I need; don't set up a project around them.
