import express from 'express';
const chatRouter = express.Router();

chatRouter.get("/", async (req, res) => {
  try {
    res.render("chat", {});
  } catch (error) {
    res.status(error.status || 500).json({
      status: "error",
      payload: error.message,
    });
  }
});

export default chatRouter;