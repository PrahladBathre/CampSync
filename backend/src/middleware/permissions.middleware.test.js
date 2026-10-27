import test from "node:test";
import assert from "node:assert/strict";
import { ROLE_PERMISSIONS, requirePermission } from "./permissions.middleware.js";

const run = (role, permission) => new Promise((resolve) => {
  requirePermission(permission)({ account: role ? { role } : null }, {}, (error) => resolve(error || null));
});

test("student cannot manage another student's personal record", async () => {
  assert.equal(ROLE_PERMISSIONS.student.includes("student:update:personal"), false);
  assert.equal((await run("student", "student:update:personal"))?.statusCode, 403);
});

test("teacher can create students but cannot edit personal records", async () => {
  assert.equal(await run("teacher", "student:create"), null);
  assert.equal((await run("teacher", "student:update:personal"))?.statusCode, 403);
  assert.equal((await run("teacher", "student:delete"))?.statusCode, 403);
});

test("admin cannot manage admin accounts or system permissions", async () => {
  assert.equal(await run("admin", "teacher:manage"), null);
  assert.equal((await run("admin", "admin:manage"))?.statusCode, 403);
  assert.equal((await run("admin", "system:permissions"))?.statusCode, 403);
});

test("only superadmin receives administrator and system permissions", async () => {
  assert.equal(await run("superadmin", "admin:manage"), null);
  assert.equal(await run("superadmin", "system:permissions"), null);
  assert.equal((await run(undefined, "notes:download"))?.statusCode, 403);
});
