# Shared account work: status and verification

## Scope of this branch

This branch introduces an additive shared Account model, account-scoped login/session/profile/password endpoints under /api/auth, a role guard primitive, legacy teacher-route authentication hardening, and a read-only migration planner. It deliberately does not provision accounts from existing records, create privileged accounts, or change academic collections.

## Acceptance checklist

### Account authentication
- [ ] Valid active shared account can log in by email or username.
- [ ] Invalid password, unknown account, pending account, and suspended account have the same 401 response.
- [ ] Missing identifier/password is rejected.
- [ ] Cookie is HttpOnly, SameSite=Lax, scoped to /, and Secure in production.
- [ ] /api/auth/me rejects missing, malformed, expired, suspended, and revoked sessions.
- [ ] Logout increments token version and clears cookies.
- [ ] Password change requires current password, validates strength, increments token version, and clears session cookies.
- [ ] API responses never return password hashes or token version.

### Profile and roles
- [ ] Profile endpoint accepts only displayName and phone; role/status/email/record links/tokenVersion cannot be changed.
- [ ] Students cannot read or mutate another student's personal profile.
- [ ] Teachers can create students and perform only authorized academic operations, not edit/delete student personal accounts.
- [ ] Admin can manage student/teacher accounts but cannot create or promote admins.
- [ ] Only the designated Super Admin can provision/promote admins; the last Super Admin cannot be disabled.
- [ ] All private academic read and write endpoints are checked server-side for authentication and permission.
- [ ] Role-injection and object-ID tampering tests fail closed.

### Migration and regression
- [ ] Backup restore succeeds in isolated staging before any migration write.
- [ ] Read-only planner reports counts and duplicate email collisions without writes.
- [ ] Duplicate/ambiguous identities are manually reconciled; no auto-merge by email.
- [ ] Counts, links, and rollback are verified on sanitized staging data.
- [ ] No production migration runs without separate approval.
- [ ] Frontend build/lint and backend test suites pass.
- [ ] Existing LogoSync, Material UI theme toggle, and responsive layouts are unchanged.

## Current limitations (must be resolved before production)

- Existing legacy Teacher and academic records are not yet linked to Account. The migration planner is read-only; there is intentionally no automatic provisioning or password-hash copying.
- The role guard exists but the legacy academic CRUD routes still need a reviewed, complete permission mapping before shared accounts are enabled for those APIs.
- Account profile API is available, but the existing login/profile UI has not yet been switched to the new account flow.
- Email-change verification, avatar upload validation, admin provisioning, and Super Admin recovery are not implemented in this foundation.
- No runtime/database-backed acceptance tests have been executed in this environment.

This is a foundation change, not a production-ready auth cutover. Keep the PR in draft until the remaining checklist is implemented and verified.
