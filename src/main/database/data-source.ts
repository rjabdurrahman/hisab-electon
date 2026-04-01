import "reflect-metadata";
import { DataSource } from "typeorm";
import { app } from "electron";
import * as path from "path";
import { Patient } from "./entities/Patient";
import { Doctor } from "./entities/Doctor";
import { Investigation } from "./entities/Investigation";
import { Consultation } from "./entities/Consultation";
import { PathologyTest } from "./entities/PathologyTest";
import { PathologyTestInvestigation } from "./entities/PathologyTestInvestigation";

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
  entities: [
    Patient,
    Doctor,
    Investigation,
    Consultation,
    PathologyTest,
    PathologyTestInvestigation,
  ],
  subscribers: [],
  migrations: [],
});
