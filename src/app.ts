import express from "express";
// import moment from "moment";
// import { sign } from "./utils/jwt";
const app = express();

app.get("/", async (_, res) => {
  // console.log(
  //   await sign({
  //     foo: "bar",
  //   })
  // );
  // console.log();
  res.send("hello shits");
});

export default app;
