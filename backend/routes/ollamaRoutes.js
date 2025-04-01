import express from "express";
const router = express.Router();

import { analyzeReviews, ollamagenai } from "../controllers/ollamaControler.js";

router.route("/").get(ollamagenai);
router.route("/genaireview/:id").get(analyzeReviews);

export default router;








