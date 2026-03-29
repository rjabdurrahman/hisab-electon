import "reflect-metadata";
import { DataSource } from "typeorm";
import { app } from "electron";
import * as path from "path";
import { Category } from "./entities/Category";
import { Product } from "./entities/Product";

let dbPath = "database.sqlite";
if (app) {
  // Store db in app data folder in production/dev
  dbPath = path.join(app.getPath("userData"), dbPath);
}

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  synchronize: true, // Only for dev, use migrations in production
  logging: false,
  entities: [Category, Product],
  subscribers: [],
  migrations: [],
});
