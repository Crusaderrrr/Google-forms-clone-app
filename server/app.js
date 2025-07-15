require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./routes/auth");
const templates = require("./routes/templates");
const forms = require("./routes/forms");
const users = require("./routes/users");
const tags = require("./routes/tags");
const comments = require("./routes/comments");
const likes = require("./routes/likes");
const templateSearch = require("./routes/templateSearch");
const sf = require("./routes/salesforce");
const jwt = require("./routes/jwt");
const odoo = require("./routes/odoo");
const session = require("express-session");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
    },
  })
);

app.use("/api/auth", auth);
app.use("/api/templates", templates);
app.use("/api/forms", forms);
app.use("/api/users", users);
app.use("/api/tags", tags);
app.use("/api/search", templateSearch);
app.use("/api/comments", comments);
app.use("/api/likes", likes);
app.use("/api/sf", sf);
app.use("/api/jwt", jwt);
app.use("/api/odoo", odoo);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});