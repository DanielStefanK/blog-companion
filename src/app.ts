import express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import lampRoutes from "./routes/lamp";

const app = express();

app.use((req, res, next) => {
  console.log("imcoming request")
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  bodyParser.json({
    limit: "50mb",
    verify(req: any, res, buf, encoding) {
      req.rawBody = buf;
    },
  })
);

app.use("/lamp", lampRoutes);
export { app };
