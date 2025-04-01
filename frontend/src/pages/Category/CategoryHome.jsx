import React from "react";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CategoryHome = () => {
  const { data: categories } = useFetchCategoriesQuery();

  const CategoryList = ({ categories }) => {
    const navigate = useNavigate();

    return (
      <Box
        sx={{
          my: 6,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4" // Increased size from h5 to h4
          gutterBottom
          sx={{
            fontWeight: 800, // Bolder font
            color: "text.primary",
            mb: 4,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div className="relative px-28 mb-8">
            {/* Border before */}
            <div className="absolute left-24 right-24 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

            {/* Main heading */}
            <div className="relative flex justify-center">
              <h1 className="text-4xl font-bold text-black bg-white px-6 z-10 inline-block">
                Shop By category
              </h1>
            </div>

            {/* Border after */}
            <div className="absolute left-24 right-24 bottom-1/4 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
          </div>{" "}
        </Typography>

        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 3,
            py: 2,
            width: "100%",
            justifyContent: "center", // Center categories horizontally
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar for Chrome/Safari
            },
            "&": {
              "-ms-overflow-style": "none", // Hide scrollbar for IE/Edge
            },
          }}
        >
          {categories?.map((category) => (
            <Box
              key={category._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 160, // Increased width
                cursor: "pointer",
                mx: 1, // Horizontal margin
                "&:hover": {
                  "& .MuiAvatar-root": {
                    transform: "scale(1.1)",
                    boxShadow: 3,
                  },
                },
              }}
              onClick={() => navigate(`/products?category=${category.name}`)}
            >
              <Avatar
                src={category.image}
                alt={category.name}
                sx={{
                  width: 160, // Increased size
                  height: 160, // Increased size
                  mb: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  backgroundColor: "transparent",
                  "& img": {
                    objectFit: "scale-down",
                    objectPosition: "center",
                  },
                }}
              />
              <Typography
                variant="h6" // Larger text size (subtitle2 → h6)
                sx={{
                  fontWeight: 700, // Bold text
                  color: "text.primary",
                  textAlign: "center",
                  maxWidth: 150, // Increased width
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "1.25rem", // Explicit font size
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <CategoryList categories={categories} />
    </Box>
  );
};

export default CategoryHome;
