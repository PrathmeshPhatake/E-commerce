import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image container with hover effects */}
      <div className="relative h-[20rem] overflow-hidden rounded-lg transition-all duration-500 group-hover:ring-2 group-hover:ring-pink-300 group-hover:shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Image overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Heart icon with hover effect */}
        <HeartIcon 
          product={product} 
          className="absolute top-4 right-4 text-white drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" 
        />
        
        {/* Quick view button (appears on hover) */}
        
      </div>

      {/* Product info with hover effects */}
      <div className="p-4 transition-all duration-300 group-hover:bg-pink-50 rounded-b-lg">
        <Link to={`/product/${product._id}`} className="group-hover:text-pink-700">
          <h2 className="flex justify-between items-center">
            <div className="text-lg font-medium transition-colors duration-300 group-hover:text-pink-700">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-105">
              $ {product.price.toFixed(2)}
            </span>
          </h2>
          
          {/* Additional info that appears on hover */}
          <div className="mt-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <div className="flex items-center space-x-1">
              <span className="text-amber-400">★★★★☆</span>
              <span>(24 reviews)</span>
            </div>
            <p className="mt-1 line-clamp-2">{product.description?.substring(0, 100)}...</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;