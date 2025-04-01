import express from "express";
const router = express.Router();

import { analyzeReviews, chatbotProductSuggestions, ollamagenai } from "../controllers/ollamaControler.js";

router.route("/").get(ollamagenai);
router.route("/genaireview/:id").get(analyzeReviews);
router.route("/productsuggestion").post(chatbotProductSuggestions);

export default router;








