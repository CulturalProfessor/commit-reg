import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cron from "node-cron";

cron.schedule("*/7 * * * *", () => {
  fetch("https://mettl-hack.onrender.com/api")
    .then(() => {
      console.log("Server is awake");
    })
    .catch((error) => {
    console.log("Error: ", error);
    });
});


dotenv.config();

const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;
const secretKey = process.env.VITE_SECRET_KEY;

const origin = process.env.ORIGIN;
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: origin,
  credentials: false,
  optionSuccessStatus: 200,
};
const app = express();

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// Set preflight
// app.options("*", (req, res) => {
//   console.log("preflight");
//   if (
//     req.headers.origin === origin &&
//     allowMethods.includes(req.headers["access-control-request-method"]) &&
//     allowHeaders.includes(req.headers["access-control-request-headers"])
//   ) {
//     console.log("pass");
//     return res.status(204).send();
//   } else {
//     console.log("fail");
//   }
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", origin);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Private-Network", true);
//   //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//   res.setHeader("Access-Control-Max-Age", 7200);

//   next();
// });

app.use(ExpressMongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Max-Age", "86400");

  console.log("middleware");
  res.status(200);
  next();
});

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
