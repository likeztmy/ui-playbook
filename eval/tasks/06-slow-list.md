---
size: flow
---
# Customer directory

A CRM's customer directory: 200 customers (invent them), each with avatar, name, company, plan,
monthly revenue and sign-up date.

The list loads from a fake API. Its delay in milliseconds comes from the page URL's `delay`
parameter (default 800). Above the list: a **Search customers** box, and filters for **Plan** (Free,
Pro, Enterprise) and **Status** (Active, Churned). Searching and filtering ask the API again, with
the same delay. Clicking a customer opens their details.
