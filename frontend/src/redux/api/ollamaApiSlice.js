import { OLLAMA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ollamaApiSlice=apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSummarizedReview:builder.query({
            query:({productId})=>({
                url: `${OLLAMA_URL}/genaireview/${productId}`,
                method: 'GET'
            })
        })
    }),
});
export const {
    useGetSummarizedReviewQuery
}=ollamaApiSlice;