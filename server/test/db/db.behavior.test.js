import { describe, it, expect } from "vitest";
import { User } from "../../src/api/auth/auth.model.js";
import {hashPassword} from "../../src/utils/auth/password.js"

describe("DB isolation", () => {
  it("should NOT persist data between tests", async () => {
    await User.create({ 
        email: "persist@test.com",
        first_name:"Kevin",
        last_name:"Kibet",
        password: await hashPassword("Kevin")
    });

    const users = await User.findAll();
    expect(users.length).toBe(1);
  });

  it("should start fresh DB", async () => {
    const users = await User.findAll();

    // 🔥 This should be ZERO if memory DB + reset works
    expect(users.length).toBe(0);
  });
});