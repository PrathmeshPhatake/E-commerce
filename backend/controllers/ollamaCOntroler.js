import express from "express";
import axios from "axios";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'tinyllama';

const generateWithOllama = async (prompt, options = {}) => {
    const { stream = false, format = 'text', model = MODEL_NAME } = options;
    
    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model,
            prompt,
            stream,
            format: format === 'json' ? 'json' : undefined
        });

        return {
            success: true,
            data: response.data,
            rawResponse: response.data.response
        };
    } catch (error) {
        console.error('Ollama API call failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};
const ollamagenai = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        console.error("Error: No prompt provided");
        return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Received prompt: "${prompt}"`);
    
    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false
        });

        // Print full response to console
        console.log("Ollama raw response:", JSON.stringify(response.data, null, 2));
        
        // Print just the generated text
        console.log("\nGenerated text:\n", response.data.response, "\n");

        res.json({
            response: response.data.response
        });

    } catch (error) {
        console.error("Ollama API error:", error.message);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// / Specialized review analysis function
const analyzeReviews = asyncHandler(async (req, res) => {
    try {
        // 1. Get product data
        const product = await Product.findById(req.params.id)
            .select('name reviews')
            .lean();
            console.log("req.params.id",req.params.id);
        if (!product?.reviews?.length) {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this product"
            });
        }

        // 2. Prepare review context
        const reviewContext = product.reviews
            .map((r, i) => `Review ${i + 1}: ${r.rating} stars - "${r.comment || 'No comment'}"`)
            .join('\n');

        // 3. Generate analysis prompt
        const prompt = `
            Analyze these product reviews for "${product.name}" and provide:
            1. Three key strengths (pros)
            2. Three areas for improvement (cons)
            3. Overall sentiment score (1-5)
            
            Format as valid JSON: { "pros": [], "cons": [], "sentiment_score": number }
            
            Reviews:
            ${reviewContext}
        `;

        // 4. Get analysis from Ollama
        const analysis = await generateWithOllama(prompt, { format: 'json' });
        
        if (!analysis.success) {
            throw new Error(analysis.error);
        }

        // 5. Validate and parse response
        let summary;
        try {
            summary = JSON.parse(analysis.rawResponse);
            if (!summary.pros || !summary.cons || !summary.sentiment_score) {
                throw new Error('Invalid response structure');
            }
        } catch (e) {
            console.error('Invalid analysis format:', analysis.rawResponse);
            throw new Error('Failed to parse analysis results');
        }

        // 6. Return structured response
        res.json({
            success: true,
            product: product.name,
            reviewCount: product.reviews.length,
            summary
        });

    } catch (error) {
        console.error('Review analysis failed:', error.message);
        res.status(500).json({
            success: false,
            message: "Review analysis failed",
            error: error.message
        });
    }
});

export { ollamagenai, analyzeReviews };
