import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success("Added to cart", {
      position: "top-right",
      className: "bg-[#5D534A] text-[#F3EEEA]",
      progressStyle: { background: "#B0A695" }
    });
  };

  return (
    <div className="w-full bg-[rgb(237,226,217)] rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-[#D9CDC1] group">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Link to={`/product/${p._id}`} className="block h-full w-full">
          {/* Premium Ribbon */}
          {p.premium && (
            <div className="absolute top-3 left-0 bg-[#776B5D] text-[#F3EEEA] px-3 py-1 text-xs font-bold uppercase z-10 shadow-md">
              Premium
            </div>
          )}
          
          {/* Brand Tag */}
          <div className="absolute bottom-3 right-3 bg-[#F3EEEA]/90 text-[#776B5D] px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-[#D9CDC1]">
            {p.brand}
          </div>
          
          {/* Product Image */}
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={p.image}
            alt={p.name}
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#776B5D]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Heart Icon */}
        <HeartIcon 
          product={p} 
          className="absolute top-3 right-3 text-[#776B5D] hover:text-[#B0A695] transition-colors z-10" 
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-[#5D534A] line-clamp-1">
            {p.name}
          </h3>
          <p className="text-[#776B5D] font-bold text-lg">
            {p.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0
            })}
          </p>
        </div>

        {/* Description */}
        <p className="mb-4 text-[#776B5D]/90 text-sm line-clamp-2">
          {p.description?.substring(0, 80)}...
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 mr-2 py-2.5 text-center text-sm font-medium text-[#F3EEEA] bg-[#776B5D] rounded-lg hover:bg-[#5D534A] transition-colors duration-300"
          >
            View Details
          </Link>
          
          <button
            onClick={addToCartHandler}
            className="p-2.5 rounded-lg bg-[#EBE3D5] hover:bg-[#776B5D] text-[#5D534A] hover:text-[#F3EEEA] transition-colors duration-300 border border-[#D9CDC1]"
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;