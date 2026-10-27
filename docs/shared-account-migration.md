# Shared account migration safety

## Current implementation boundary

The shared `Account` model and `/api/auth` endpoints are additive. Existing Teacher and Student collections remain intact. No automatic account provisioning or record merge occurs at application startup or in the migration planner.

## Required staged migration procedure

1. Take a database backup and perform a restore test into an isolated staging database.
2. Run `node scripts/migrate-accounts.js` with staging-only environment variables. This command is read-only and reports counts and normalized email collisions.
3. Reconcile Teacher, Student, and Account counts. Resolve duplicate emails and ambiguous ownership manually; never merge by email alone.
4. Design and review a separate write migration. Ensure links are deterministic, idempotent, and reversible before implementation.
5. Keep legacy records and password hashes unchanged during the first cutover. Do not copy password hashes unless hash format and login compatibility are verified; otherwise require a secure password reset.
6. Test migration and rollback on sanitized staging data, compare counts and links, and retain the pre-migration backup.
7. Production execution requires separate explicit approval. Do not run a migration against production as part of a PR.

## Role provisioning

Public registration must never accept `role`, `status`, `tokenVersion`, or record-link fields. No endpoint in this change creates or promotes administrators. Designated Super Admin bootstrap must be a separately reviewed, audited operational procedure with recovery steps.

## API security

- Shared account endpoints reject suspended and pending accounts.
- Profile edits accept only `displayName` and `phone`; role, status, email, record links, and token state are not writable through profile updates.
- Password changes require the current password and invalidate existing account access tokens.
- Role checks belong on server routes and service methods, not only in React UI.
