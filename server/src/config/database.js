import { Sequelize, QueryTypes, DataTypes } from "sequelize";
import { config} from "./env.config.js";
import { logger } from "./logger.config.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.db.path, // file-based DB
  logging: msg=>logger.debug(msg),
  define: {
    freezeTableName: true,
    timestamps:true
  },
});

export {sequelize, DataTypes}