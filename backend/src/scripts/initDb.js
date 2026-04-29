import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../db/schema.sql");

try {
  const schema = await fs.readFile(schemaPath, "utf8");
  await pool.query(schema);
  console.log("Database schema applied successfully.");
} catch (error) {
  console.error("Failed to apply database schema.");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
