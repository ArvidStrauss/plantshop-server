require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connected to database"));

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const userRouter = require("./routes/users");
app.use("/users", userRouter);

app.listen(PORT, () => console.log(`server started on Port ${PORT}`));
