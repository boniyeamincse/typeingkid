import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeRoles, ROLE } from '../src/middleware/authMiddleware.js';

const createRes = () => {
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };

  return response;
};

test('authorizeRoles allows matching role', () => {
  const req = { user: { id: 'u1', role: ROLE.ADMIN } };
  const res = createRes();
  let called = false;

  authorizeRoles(ROLE.ADMIN)(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test('authorizeRoles blocks non-matching role', () => {
  const req = { user: { id: 'u2', role: ROLE.USER } };
  const res = createRes();
  let called = false;

  authorizeRoles(ROLE.ADMIN)(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.match(res.payload.message, /Forbidden/);
});

test('authorizeRoles blocks missing role', () => {
  const req = { user: { id: 'u3' } };
  const res = createRes();
  let called = false;

  authorizeRoles(ROLE.EDUCATOR, ROLE.ADMIN)(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 401);
});
