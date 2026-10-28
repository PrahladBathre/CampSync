# CampSync demo accounts (test database only)

This utility creates one disposable account for each shared-account role: superadmin, admin, teacher, and student. It does **not** create legacy Teacher/Student academic records, and it does not modify an account that already exists.

## Safety requirements

- Use a dedicated test database such as `campsync_test`; never point this at production.
- The script ignores the app's `DATABASE` setting and requires `TEST_MONGODB_URI` explicitly.
- It requires `SEED_DEMO_ACCOUNTS=true` and four separate password environment variables.
- Existing matching usernames/emails are skipped without changing their password or role.

## Run

From the `backend` directory, create a local `.env.seed` file (do not commit it) with:

```dotenv
SEED_DEMO_ACCOUNTS=true
TEST_MONGODB_URI=mongodb+srv://<test-user>:<url-encoded-password>@<cluster>/<campsync_test>?retryWrites=true&w=majority
DEMO_SUPERADMIN_PASSWORD=<unique-test-password-at-least-12-chars>
DEMO_ADMIN_PASSWORD=<different-unique-test-password>
DEMO_TEACHER_PASSWORD=<different-unique-test-password>
DEMO_STUDENT_PASSWORD=<different-unique-test-password>
```

Then run:

```bash
node --env-file=.env.seed scripts/seed-demo-accounts.js
```

Save the credentials in your local password manager. This script prints usernames and Mongo IDs only, never passwords. The accounts use the shared `/api/auth/login` contract (`identifier` + `password`); they will not automatically authenticate through the legacy teacher-only login form until that UI is connected to shared auth.

## Important

These are test-only identities. Do not use demo passwords on a public production service. Account roles are not a substitute for endpoint authorization: the current app still needs full route-by-route and object-level authorization before exposing privileged roles.
