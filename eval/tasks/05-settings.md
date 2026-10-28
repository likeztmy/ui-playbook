---
size: flow
---
# Workspace settings

The settings page of a team workspace, with these sections:

- **Profile**: Name, Email, Avatar (upload or remove).
- **Notifications**: email me about Mentions, Assigned to me, Weekly digest (each on or off), and a
  **Digest day** (Monday to Friday).
- **Appearance**: Theme (Light, Dark, System), applied to the page itself.
- **Region**: Time zone (searchable, all IANA zones) and Date format.

Changes save to a fake API that takes 500 ms. When the page URL has `?fail=1`, every save fails.
The page loads its current values from the same API.
