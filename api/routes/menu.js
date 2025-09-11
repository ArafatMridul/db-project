import express from "express";
import { getMenu } from "../controllers/menu.js";

const router = express.Router();

router.get("/", getMenu);

export default router;