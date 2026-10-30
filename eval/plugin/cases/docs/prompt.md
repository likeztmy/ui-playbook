---
tags: [floors,layout]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
---

A documents app for one person, in the browser: a sidebar listing 30 documents, newest first, with **New document**, a search box and, at its foot, the storage status; beside it, the open document, editable, with a title and a long body.

Write it as a React + TypeScript component in `Docs.tsx`, with its styles in `Docs.module.css` (a CSS module), plus any global styles the layout needs in that same file under `:global`. Invent realistic sample data, with one long document. Those two files are all I need; don't set up a project around them.
