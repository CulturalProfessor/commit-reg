import express from "express";
import { create, find } from "../controllers/controller.js";
import limiter from "../middlewares/rate-limiter.js";
const routes = express.Router();

routes.post("/commit",limiter,create);
routes.get("/commit", find);

export default routes;
