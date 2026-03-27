import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLE, hasRequiredRole, getDefaultRouteForRole } from './roleUtils.js';

test('hasRequiredRole returns true when allowed role matches', () => {
  assert.equal(hasRequiredRole(ROLE.ADMIN, [ROLE.ADMIN]), true);
  assert.equal(hasRequiredRole(ROLE.EDUCATOR, [ROLE.EDUCATOR, ROLE.ADMIN]), true);
});

test('hasRequiredRole returns false when role is not allowed', () => {
  assert.equal(hasRequiredRole(ROLE.USER, [ROLE.ADMIN]), false);
  assert.equal(hasRequiredRole(null, [ROLE.USER]), false);
});

test('getDefaultRouteForRole maps each role to expected route', () => {
  assert.equal(getDefaultRouteForRole(ROLE.USER), '/dashboard');
  assert.equal(getDefaultRouteForRole(ROLE.EDUCATOR), '/educator');
  assert.equal(getDefaultRouteForRole(ROLE.ADMIN), '/admin');
  assert.equal(getDefaultRouteForRole('UNKNOWN'), '/dashboard');
});
