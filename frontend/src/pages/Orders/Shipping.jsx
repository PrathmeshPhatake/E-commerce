import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <ProgressSteps step1 step2 />
        
        <div className="mt-8 flex justify-center">
          <form 
            onSubmit={submitHandler} 
            className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8"
          >
            <h1 className="text-2xl font-bold text-[#5D534A] mb-6">Shipping Details</h1>
            
            {/* Address Field */}
            <div className="mb-6">
              <label className="block text-[#5D534A] font-medium mb-2">Address</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#5D534A] placeholder-[#B0A695]/70"
                placeholder="Enter street address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#5D534A] font-medium mb-2">City</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#5D534A] placeholder-[#B0A695]/70"
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#5D534A] font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#5D534A] placeholder-[#B0A695]/70"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-[#5D534A] font-medium mb-2">Country</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#5D534A] placeholder-[#B0A695]/70"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="block text-[#5D534A] font-medium mb-4">Payment Method</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    className="h-5 w-5 text-[#B0A695] focus:ring-[#B0A695] border-[#EBE3D5]"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-[#5D534A]">PayPal or Credit Card</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3 px-6 bg-[#776B5D] text-white font-medium rounded-lg hover:bg-[#5D534A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#B0A695] focus:ring-offset-2"
              type="submit"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;