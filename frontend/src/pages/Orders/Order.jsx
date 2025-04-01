import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "INR" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful", {
          className: "bg-[#3A3632] text-[#F3EEEA]",
          progressClassName: "bg-[#8C7D6D]"
        });
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4 max-w-9xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-[#3A3632] mb-4">Order Items</h1>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#EBE3D5]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#3A3632]">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#3A3632]">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#3A3632]">Qty</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#3A3632]">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#3A3632]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3D5]">
                      {order.orderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-[#F9F7F5]">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[#3A3632]">
                            <Link 
                              to={`/product/${item.product}`} 
                              className="hover:text-[#8C7D6D] transition-colors"
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[#3A3632] text-center">
                            {item.qty}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[#3A3632]">
                            {item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "INR"
                            })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[#3A3632] font-medium">
                            {(item.qty * item.price).toLocaleString("en-US", {
                              style: "currency",
                              currency: "INR"
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              {/* Shipping Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#3A3632] mb-3">Shipping</h2>
                <div className="space-y-2 text-[#3A3632]">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Name:</strong> {order.user.username}</p>
                  <p><strong>Email:</strong> {order.user.email}</p>
                  <p>
                    <strong>Address:</strong> {order.shippingAddress.address},<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                  <p><strong>Method:</strong> {order.paymentMethod}</p>
                  <div className="mt-3">
                    {order.isPaid ? (
                      <Message variant="success">Paid on {new Date(order.paidAt).toLocaleString()}</Message>
                    ) : (
                      <Message variant="danger">Not paid</Message>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#3A3632] mb-3">Order Summary</h2>
                <div className="space-y-2 text-[#3A3632]">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{order.itemsPrice.toLocaleString("en-US", { style: "currency", currency: "INR" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{order.shippingPrice.toLocaleString("en-US", { style: "currency", currency: "INR" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{order.taxPrice.toLocaleString("en-US", { style: "currency", currency: "INR" })}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#D9CDC1] pt-2 mt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">{order.totalPrice.toLocaleString("en-US", { style: "currency", currency: "INR" })}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              {!order.isPaid && (
                <div className="mb-6">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="paypal-buttons-container">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => toast.error(err.message)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Deliver Button */}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <div>
                  {loadingDeliver && <Loader />}
                  <button
                    onClick={deliverHandler}
                    className="w-full py-2.5 px-4 bg-[#776B5D] text-white rounded-lg hover:bg-[#5D534A] transition-colors"
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;