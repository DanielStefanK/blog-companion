import express from "express";

var router = express.Router();

const API_KEY: string = process.env.API_KEY || "key";

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
  lampState = state;

  res.json({ success: true, lampState: lampState });
});

router.get("/state", (req, res) => {
  res.json({
    success: true,
    state: lampState,
  });
});

router.post("/toggle", (req, res) => {
  // call nr here and wait for return
  lampState = !lampState;
  res.json({ success: true, lampState: lampState });
});

export default router;
