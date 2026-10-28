---
size: flow
---
# Sign up

The sign-up page of a design tool: **Name**, **Email**, **Password**, an **I agree to the Terms**
checkbox and a **Create account** button.

Check what's typed: the email must be a valid address, and the password at least 10 characters
with a number in it. The email **ana@example.com** is already taken: a fake API says so after
600 ms. Creating the account also goes through the fake API (1 s). On success, show a welcome
screen with the person's name.
