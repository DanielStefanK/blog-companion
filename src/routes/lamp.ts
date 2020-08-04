import express from "express";
import request from "request";

var router = express.Router();

const API_KEY: string = process.env.API_KEY || "key";

const NODE_RED_URL: string =
  process.env.NODE_RED_URL || "http://localhost:1880/endpoint/desklamp/toggle";

const NODE_RED_USER: string = process.env.NODE_RED_USER || "geheim";
const NODE_RED_PASS: string = process.env.NODE_RED_PASS || "geheim";

let lampState = false;

const providesKey = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    res.json({
      success: false,
      error: "api key was not provided",
    });
    return;
  }

  if (apiKey !== API_KEY) {
    res.json({
      success: false,
      error: "api key invalid",
    });
    return;
  }

  next();
};

// called from node red with an api key
router.post("/set-state", providesKey, (req, res) => {
  const { state } = req.body;
  console.log(`setting the state to ${state}`);
  lampState = state;

  res.json({ success: true, lampState: lampState });
});

router.get("/state", (req, res) => {
  res.json({
    success: true,
    state: lampState,
  });
});

router.post("/toggle", async (req, res) => {
  console.log(`toggling lamp state`);
  request.post(
    NODE_RED_URL,
    {
      auth: {
        user: NODE_RED_USER,
        pass: NODE_RED_PASS,
        sendImmediately: true,
      },
    },
    () => {
      lampState = !lampState;
      res.json({ success: true, lampState: lampState });
    }
  );
});

export default router;
