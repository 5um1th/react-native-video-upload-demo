// The source for most of this backend is at https://scotch.io/tutorials/express-file-uploads-with-multer
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Loki = require("lokijs");

const PORT = process.env.PORT || 3000;
const DB_NAME = (process.env.DB_NAME || "db") + ".json";
const UPLOAD_PATH = process.env.UPLOAD_PATH || "uploads";
const COLUMN_NAME = process.env.COLUMN_NAME || "images";

const upload = multer({ dest: `${UPLOAD_PATH}/` });
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: "fs" });

const app = express();
app.use(cors());

function loadCollection(colName, db) {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const _collection =
        db.getCollection(colName) || db.addCollection(colName);
      resolve(_collection);
    });
  });
}

app.post("/", upload.single("video"), async (req, res) => {
  try {
    const col = await loadCollection(COLUMN_NAME, db);
    const data = col.insert(req.file);

    db.saveDatabase();
    res.send({
      id: data.$loki,
      fileName: data.filename,
      originalName: data.originalname
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("Video Upload Backend Working");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
