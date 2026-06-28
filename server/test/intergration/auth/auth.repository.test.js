import { AuthRepository } from "../../../src/api/auth/auth.repository.js";
import {describe, it,expect} from "vitest"

const createUser = (overrides = {email:undefined,
    first_name:undefined,
    last_name:undefined,
    password:undefined,
}) => {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return AuthRepository.create({
    email: overrides.email || `${unique}@test.com`,
    first_name: overrides.first_name || "Kevin",
    last_name: overrides.last_name || "Kibet",
    password: overrides.password || "Kevin",
  });
};

describe("AuthRepository", () => {
  it("should hash password on create", async () => {
    const user = await createUser();

    expect(user.password).toBeTruthy();
    expect(user.password).not.toBe("Kevin");
  });

  it("should not allow duplicate email", async () => {
    const email = `duplicate-${Date.now()}@test.com`;

    await createUser({ email});

    await expect(createUser({ email })).rejects.toThrow();
  });

  it("should find user by email", async () => {
    const email = `find-${Date.now()}@test.com`;

    await createUser({ email });

    const user = await AuthRepository.findByEmail(email);

    expect(user).toBeDefined();
    expect(user.email).toBe(email);
  });

  it("should find user by id", async () => {
  const user = await createUser();

  const found = await AuthRepository.findById(user.id);

  expect(found.id).toBe(user.id);
});
it("should update user", async () => {
  const user = await createUser();

  await AuthRepository.update(user.id, { first_name: "Updated" });

  const updated = await AuthRepository.findById(user.id);

  expect(updated.first_name).toBe("Updated");
});
it("should delete user", async () => {
  const user = await createUser();

  await AuthRepository.delete(user.id);

  const found = await AuthRepository.findById(user.id);

  expect(found).toBeNull();
});
});