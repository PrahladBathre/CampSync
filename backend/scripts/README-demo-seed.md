# CampSync demo accounts

## Legacy teacher login (the current login page)

The login screen calls `POST /api/teacher/login`, which authenticates against the `Teacher` collection. The shared-account seeder below creates `Account` documents and is **not** compatible with this form. Use the one-time teacher seeder if you need a demo account for the current login screen.

### Create a demo teacher in the app's configured database

Run this manually from the `backend` directory, only after confirming the configured `DATABASE` and `DB_NAME` point to the intended database. The script does not run at server startup and refuses to run unless explicitly enabled.

Set these environment variables in a private shell or an untracked env file (never commit passwords):

```dotenv
SEED_DEMO_TEACHER=true
DEMO_TEACHER_PASSWORD=<unique-password-at-least-12-chars-with-uppercase-and-number>
DEMO_TEACHER_USERNAME=demoteacher
DEMO_TEACHER_EMAIL=demo.teacher@example.com
DEMO_TEACHER_ID=UICSADEMO0001
DEMO_TEACHER_CONTACT=9000000001
```

For a local backend whose environment variables are in `backend/env`, run:

```bash
node --env-file=./env scripts/seed-demo-teacher.js
```

For a deployed environment, run the script as a one-off job/shell command with the intended database variables and a strong, unique password injected securely. If `NODE_ENV=production`, also set `ALLOW_DEMO_TEACHER_IN_PRODUCTION=true` for that one-off process only. Do not add these seed flags permanently to the web service's environment, and do not use a predictable password on a public service.

The script creates one verified legacy `Teacher` record with no assigned subjects. It refuses to overwrite a matching username, email, teacher ID, or contact number. It prints the username/email and record ID but never prints the password. After creation, log in through the existing login form using the configured username and password.

## Shared-account test seeder

`seed-demo-accounts.js` creates shared `Account` records for test databases only. It requires `TEST_MONGODB_URI`, `SEED_DEMO_ACCOUNTS=true`, and four separate password variables. It intentionally refuses production-like database names and is not compatible with the current legacy teacher login form.

See `seed-demo-accounts.js` for the guarded implementation. Do not use demo credentials on a public production service without an intentional, secured demo-access plan.
