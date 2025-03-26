import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  console.log(product);
  return (
    <div className="w-[20rem] ml-[2rem] p-3 group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:z-10">
      <div className="relative h-[15rem] overflow-hidden rounded-xl shadow-md transition-all duration-500">
        {/* Image with zoom and fade overlay */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Heart icon with hover effect */}
        <HeartIcon product={product} className="absolute top-3 right-3 scale-90 group-hover:scale-100 transition-transform duration-300" />
        
        {/* Quick view button that appears on hover */}
        <Link to={`/product/${product._id}`} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-pink-600 font-medium py-2 px-6 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-600 hover:text-white shadow-lg">
          Quick View
        </Link>
      </div>

      <div className="p-4 space-y-2">
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="flex justify-between items-center">
            <div className="text-sm font-medium text-white truncate max-w-[12rem] group-hover:text-pink-600 transition-colors duration-200">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
              ${product.price.toFixed(2)}
            </span>
          </h2>
          {/* Rating and additional info */}
          <div className="flex items-center mt-1 space-x-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating})</span>
          </div>
          {/* Stock status */}
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${product.inStock > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {product?.quantity > 0 ? `in stock` : 'Out of stock'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;