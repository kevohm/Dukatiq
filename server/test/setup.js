// test/setup.js
import { beforeAll, beforeEach, afterAll } from "vitest";
import { closeDatabase, db, pool, resetDb } from "../src/config/database";
import { logger } from "../src/config/logger.config";
import { users } from "../src/db/user";

beforeAll(async () => {
  // await sequelize.sync();
  await pool.query('SELECT 1')
  await resetDb()
});

beforeEach(async () => {
  // await sequelize.sync({ force: true }); // reset DB
     await resetDb()
})

afterAll(async () => {
  // await sequelize.close();
  await db.delete(users)
  await closeDatabase()
});