import { AuthRepository } from "../../../src/api/auth/auth.repository.js";
import {describe, it,expect} from "vitest"
import { userFactory } from "../../utils/factory.js";

export const createUser = async (overrides = {}) => {
    const data = userFactory(overrides)
    return AuthRepository.create(data)
}


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