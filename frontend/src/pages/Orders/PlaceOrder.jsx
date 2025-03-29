import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error, {
        className: "bg-[#5D534A] text-[#F3EEEA]",
        progressClassName: "bg-[#B0A695]"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <ProgressSteps step1 step2 step3 />

        {cart.cartItems.length === 0 ? (
          <Message className="bg-white rounded-xl shadow-md p-6 text-center">
            Your cart is empty
          </Message>
        ) : (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            {/* Order Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#EBE3D5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE3D5]">
                  {cart.cartItems.map((item, index) => (
                    <tr key={index} className="hover:bg-[#F9F7F5]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#5D534A]">
                        <Link 
                          to={`/product/${item.product}`} 
                          className="hover:text-[#B0A695] transition-colors"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#5D534A]">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#5D534A]">
                        {item.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD"
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#5D534A] font-medium">
                        {(item.qty * item.price).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-[#EBE3D5]">
              {/* Order Totals */}
              <div className="bg-[#F9F7F5] rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#5D534A] mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#5D534A]">Items:</span>
                    <span className="font-medium text-black">
                      {cart.itemsPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D534A]">Shipping:</span>
                    <span className="font-medium text-black">
                      {cart.shippingPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D534A]">Tax:</span>
                    <span className="font-medium text-black">
                      {cart.taxPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#EBE3D5] pt-3">
                    <span className="text-[#5D534A] font-bold">Total:</span>
                    <span className="font-medium text-black">
                      {cart.totalPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-[#F9F7F5] rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#5D534A] mb-4">Shipping</h3>
                <div className="text-[#5D534A] space-y-2">
                  <p><strong>Address:</strong></p>
                  <p>{cart.shippingAddress.address}</p>
                  <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                  <p>{cart.shippingAddress.country}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#F9F7F5] rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#5D534A] mb-4">Payment</h3>
                <div className="text-[#5D534A]">
                  <p><strong>Method:</strong></p>
                  <p className="capitalize">{cart.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="p-6 border-t border-[#EBE3D5]">
              {error && (
                <Message variant="danger" className="mb-4">
                  {error.data.message}
                </Message>
              )}
              
              <button
                type="button"
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                  cart.cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#776B5D] hover:bg-[#5D534A] text-white"
                }`}
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
              
              {isLoading && <Loader className="mt-4" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;