import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div 
      className="w-[25rem] ml-[2rem] p-3 mt-4 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{ backgroundColor: "#F3EEEA" }} // Base background
    >
      {/* Image container with hover effects */}
      <div 
        className="relative h-[20rem] overflow-hidden rounded-lg transition-all duration-500 group-hover:ring-2 group-hover:shadow-md"
        style={{ borderColor: "#B0A695" }} // Subtle border color
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-fill transition-transform duration-700" // Removed hover:scale
          style={{
            objectPosition: "center"
          }}
        />
        
        {/* Image overlay effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#776B5D]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        
        {/* Heart icon with hover effect */}
        <HeartIcon 
          product={product} 
          className="absolute top-4 right-4 text-[#F3EEEA] drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-[#776B5D]" 
        />
      </div>

      {/* Product info with hover effects */}
      <div 
        className="p-4 transition-all duration-300 rounded-b-lg group-hover:bg-[#EBE3D5]"
        style={{ 
          borderTop: "2px solid #B0A695" // Enhanced border
        }}
      >
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div 
              className="text-base font-semibold transition-colors duration-300" // Smaller and bolder
              style={{ 
                color: "#5D534A", // Darker text
                fontFamily: "'Inter', sans-serif" // Modern font
              }}
            >
              {product.name}
            </div>
            <span 
              className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 group-hover:scale-105" // Smaller text
              style={{ 
                backgroundColor: "#EBE3D5",
                color: "#5D534A", // Darker text
                hoverBackground: "#776B5D",
                hoverColor: "#F3EEEA",
                letterSpacing: "0.5px" // Improved readability
              }}
            >
              $ {product.price.toFixed(2)}
            </span>
          </h2>
          
          {/* Additional info that appears on hover */}
          <div 
            className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" // Smaller text
            style={{ 
              color: "#5D534A", // Darker text
              lineHeight: "1.5" // Better readability
            }}
          >
            <div className="flex items-center space-x-1">
              <span className="text-amber-400">★★★★☆</span>
              <span>(24 reviews)</span>
            </div>
            <p className="mt-1 line-clamp-2">
              {product.description?.substring(0, 100)}...
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;