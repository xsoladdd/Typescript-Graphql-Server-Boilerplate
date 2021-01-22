import { createConnection } from "typeorm";
import path from "path";
import { config } from "dotenv";

config();

export default createConnection({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  migrations: [path.join(__dirname, "../migrations/*")],
  entities: [path.join(__dirname, "../entity/*.js")],
});
