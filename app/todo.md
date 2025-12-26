📝 Project TODO: On-Demand Email Aliases
Status: NOT DONE

Goal: Allow users to create job-specific aliases (e.g., company-role@roledeck.io) that forward to their private email.

Technical Requirements:
Configure Resend Inbound MX records for the domain.
Create a Next.js API route (/api/webhooks/inbound) to receive Resend webhooks.
Implement Supabase lookup logic to match alias prefixes to user emails.
Use Resend's emails.send to forward the content with a rewritten, descriptive subject line.
