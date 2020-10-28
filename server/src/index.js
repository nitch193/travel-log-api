const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middlewares = require("./middlewares");
const logs = require("./api/logs");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Howdy World",
  });
});

app.use("/api/logs", logs);
// We are using two middleware
// first is below for "not found" error handling
app.use(middlewares.notFound);

// next is vbel;ow which is used for handling ala the other general errors
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listing at http://localhost:${port}`);
});
