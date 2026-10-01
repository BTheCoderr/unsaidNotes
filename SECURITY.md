# Security Policy

Security fixes target the current default branch.

Report vulnerabilities privately through GitHub when they could expose journal entries, authentication data, Supabase records, AI-provider keys, generated reflections, or privileged API behavior.

Extra review is expected for Auth/RLS, note ownership, AI request/response storage, provider failover, debug routes, export/deletion behavior, and any feature that could leak unsent/private content.

Never commit production secrets, service-role keys, provider credentials, or real journal content.
