import test from "node:test";
import assert from "node:assert/strict";
import { allowRoles } from "./accountAuth.middleware.js";

const runMiddleware = (req, roles) => new Promise((resolve) => {
  allowRoles(...roles)(req, {}, (error) => resolve(error || null));
});

test("role guard rejects missing account context", async () => {
  const error = await runMiddleware({}, ["admin", "superadmin"]);
  assert.equal(error?.statusCode, 403);
});

test("role guard permits a role explicitly listed", async () => {
  const error = await runMiddleware({ account: { role: "teacher" } }, ["teacher", "admin", "superadmin"]);
  assert.equal(error, null);
});

test("role guard rejects unlisted role", async () => {
  const error = await runMiddleware({ account: { role: "student" } }, ["teacher", "admin", "superadmin"]);
  assert.equal(error?.statusCode, 403);
});
