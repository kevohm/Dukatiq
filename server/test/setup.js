// test/setup.js
import { beforeAll, beforeEach, afterAll } from "vitest";
import { sequelize } from "../src/config/database.js";

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await sequelize.sync({ force: true }); // reset DB
});

afterAll(async () => {
  await sequelize.close();
});