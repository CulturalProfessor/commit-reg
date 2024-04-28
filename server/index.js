import express from "express";
import mongoose from "mongoose";
// import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();

const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;
const secretKey = process.env.VITE_SECRET_KEY;

const origin = process.env.ORIGIN;
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
// const corsOptions = {
//   origin: origin,
//   credentials: true,
//   optionSuccessStatus: 200,
// };
const app = express();

// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
//   allowedHeaders: [
//     "Accept",
//     "Content-Type",
//     "Referer",
//     "Access-Control-Allow-Origin",
//     "Sec-Ch-Ua",
//     "Sec-Ch-Ua-Mobile",
//     "Sec-Ch-Ua-Platform",
//     "User-Agent",
//   ],
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.sendStatus(200);
}); 
app.use(ExpressMongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
