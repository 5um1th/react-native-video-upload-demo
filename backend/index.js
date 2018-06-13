const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.post("/", (req, res) => {});

app.get("/", (req, res) => {
  res.send("Video Upload Backend Working");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
