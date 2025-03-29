import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen bg-[#F3EEEA] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-[#776B5D] mb-4">Your cart is empty</h2>
            <Link 
              to="/shop" 
              className="inline-block bg-[#B0A695] text-white px-6 py-2 rounded-lg hover:bg-[#9a662c] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-[#776B5D] mb-6">Shopping Cart</h1>
              
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 py-2 bg-[#EBE3D5] rounded-t-lg">
                <div className="col-span-5 font-medium text-[#776B5D]">Product</div>
                <div className="col-span-2 font-medium text-[#776B5D]">Price</div>
                <div className="col-span-3 font-medium text-[#776B5D]">Quantity</div>
                <div className="col-span-2 font-medium text-[#776B5D] text-right">Subtotal</div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image & Name */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div>
                        <Link 
                          to={`/product/${item._id}`} 
                          className="text-lg font-medium text-[#776B5D] hover:text-[#B0A695] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-[#B0A695]">{item.brand}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-[#776B5D] font-medium">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-3">
                      <select
                        className="w-full p-2 border border-[#EBE3D5] rounded text-[#776B5D] focus:outline-none focus:ring-1 focus:ring-[#B0A695]"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="col-span-2 flex items-center justify-end space-x-4">
                      <div className="font-medium text-[#776B5D]">
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="text-[#B0A695] hover:text-[#776B5D] transition-colors"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-64">
                <h2 className="text-xl font-bold text-[#776B5D] mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#776B5D]">
                    <span>Subtotal</span>
                    <span>
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#776B5D]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-[#EBE3D5] pt-2 flex justify-between font-bold text-lg text-[#776B5D]">
                    <span>Total</span>
                    <span>
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    cartItems.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#776B5D] hover:bg-[#B0A695]'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;