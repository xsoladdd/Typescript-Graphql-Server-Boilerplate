import express from "express";
// import moment from "moment";
// import { sign } from "./utils/jwt";
const app = express();

app.get("/", async (_, res) => {
  res.send("hello world");
});

export default app;
