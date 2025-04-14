import express from "express";
import axios from "axios";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js"; 

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'codegemma:2b'; // Changed from tinyllama


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
        console.log("sumarize review:",summary);

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
const chatbotProductSuggestions = asyncHandler(async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Step 1: Enhanced requirement extraction
        const extractionPrompt = `
        Analyze this shopping query and extract requirements in JSON format:
        {
            "brand": "extracted brand or null",
            "minPrice": number or null,
            "maxPrice": number or null,
            "features": ["array of key features"],
            "category": "extracted category or null",
            "minRating": number or null,
            "keywords": ["important keywords from query"]
        }
        
        Examples:
        - "Best smartphones under 50000" → {"category":"smartphone","maxPrice":50000}
        - "Apple laptops with 16GB RAM" → {"brand":"Apple","category":"laptop","features":["16GB RAM"]}
        - "Phones with good camera rating above 4" → {"category":"phone","features":["camera"],"minRating":4}
        
        Current query: "${message}"
        `;

        const extractionResponse = await generateWithOllama(extractionPrompt, { format: 'json' });
        console.log("extractionResponse:",extractionResponse);
        if (!extractionResponse.success) {
            throw new Error("Failed to extract requirements");
        }

        let requirements;
        try {
            requirements = JSON.parse(extractionResponse.rawResponse);
        } catch (e) {
            throw new Error("Failed to parse requirements");
        }

        // Step 2: Build smart database query
        let query = {};
        let searchText = [];
        
        // Brand filter
        if (requirements.brand) {
            query.brand = { $regex: new RegExp(requirements.brand.trim(), 'i') };
            searchText.push(requirements.brand);
        }
        
        // Price range
        if (requirements.minPrice || requirements.maxPrice) {
            query.price = {};
            if (requirements.minPrice) query.price.$gte = Number(requirements.minPrice);
            if (requirements.maxPrice) query.price.$lte = Number(requirements.maxPrice);
        }
        
        // Rating filter
        if (requirements.minRating) {
            query.rating = { $gte: Number(requirements.minRating) };
        }
        
        // Category filter (with text search fallback)
        if (requirements.category) {
            const category = await Category.findOne({
                name: { $regex: new RegExp(requirements.category, 'i') }
            });
            
            if (category) {
                query.category = category._id;
            } else {
                searchText.push(requirements.category);
            }
        }
        
        // Feature/keyword search
        if (requirements.features && requirements.features.length > 0) {
            searchText = [...searchText, ...requirements.features];
        }
        
        if (requirements.keywords && requirements.keywords.length > 0) {
            searchText = [...searchText, ...requirements.keywords];
        }
        
        // Text search fallback if no other filters
        if (searchText.length > 0 && Object.keys(query).length === 0) {
            query.$or = [
                { name: { $regex: new RegExp(searchText.join('|'), 'i') } },
                { description: { $regex: new RegExp(searchText.join('|'), 'i') } }
            ];
        }

        // Step 3: Find matching products
        let products = await Product.find(query)
            .select('name brand price description image rating numReviews category')
            .limit(20)
            .populate('category', 'name')
            .lean();

        // Step 4: AI-powered ranking when features are specified
        if (requirements.features && products.length > 1) {
            const rankingPrompt = `
            Rank these products by relevance to these features: ${requirements.features.join(', ')}
            
            For each product, return JSON with:
            {
                "id": "product ID",
                "relevance": 0-1 score,
                "matchReason": "brief explanation"
            }
            
            Products:
            ${products.map(p => `
            ID: ${p._id}
            Name: ${p.name}
            Brand: ${p.brand}
            Price: ₹${p.price}
            Rating: ${p.rating} (${p.numReviews} reviews)
            Description: ${p.description.substring(0, 200)}...
            `).join('\n\n')}
            `;

            const rankingResponse = await generateWithOllama(rankingPrompt, { format: 'json' });
            
            if (rankingResponse.success) {
                try {
                    const rankings = JSON.parse(rankingResponse.rawResponse);
                    
                    products = products.map(product => {
                        const ranking = rankings.find(r => r.id === product._id.toString());
                        return {
                            ...product,
                            relevance: ranking ? ranking.relevance : 0.5,
                            matchReason: ranking?.matchReason || 'Matches general criteria'
                        };
                    });
                    
                    // Sort by relevance, then rating, then price
                    products.sort((a, b) => {
                        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
                        if (b.rating !== a.rating) return b.rating - a.rating;
                        return a.price - b.price;
                    });
                } catch (e) {
                    console.error("Ranking parse error, using default sorting", e);
                }
            }
        }

        // Step 5: Generate natural language response
        let responseText;
        const topProducts = products.slice(0, 3);
        
        if (products.length === 0) {
            responseText = "I couldn't find products matching your request. Could you please:\n"
                         + "- Be more specific (e.g., 'gaming laptops under 60000')\n"
                         + "- Check your spelling\n"
                         + "- Try different keywords";
        } else {
            const generationPrompt = `
            User asked: "${message}"
            
            Top matching products:
            ${topProducts.map((p, i) => `
            ${i+1}. ${p.name} (${p.brand})
               - Price: ₹${p.price}
               - Rating: ${p.rating}★ (${p.numReviews} reviews)
               - Key Features: ${p.matchReason || p.description.substring(0, 80)}...
            `).join('\n')}
            
            Craft a friendly response that:
            1. Acknowledges the query
            2. Lists top 3 products with their key selling points
            3. Mentions total matches found
            4. Offers to refine the search
            `;
            
            const generationResponse = await generateWithOllama(generationPrompt);
            responseText = generationResponse.success ? generationResponse.rawResponse : 
                `I found ${products.length} options:\n` +
                topProducts.map(p => `- ${p.name} (₹${p.price}, ${p.rating}★)`).join('\n');
        }

        res.json({
            success: true,
            response: responseText,
            products: topProducts,
            totalMatches: products.length
        });

    } catch (error) {
        console.error('Chatbot suggestion error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to process your request",
            suggestion: "Try being more specific (e.g., 'gaming laptops under 60000 with 16GB RAM')"
        });
    }
});

export { ollamagenai, analyzeReviews,chatbotProductSuggestions };
