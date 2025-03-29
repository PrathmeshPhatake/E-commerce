import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-3">
      <div className=" flex container mx-auto px-4 align-middle justify-center">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminMenu />
          
          <div className="">
            <h1 className="text-2xl font-bold text-[#3A3632] mb-6">Order Management</h1>
            
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#EBE3D5]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3D5]">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#F9F7F5] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={order.orderItems[0]?.image || '/placeholder-product.jpg'}
                                alt={order._id}
                                className="w-12 h-12 object-cover rounded-lg border border-[#EBE3D5]"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D534A]">
                            {order._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D534A]">
                            {order.user ? order.user.username : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D534A]">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D534A]">
                            {order.totalPrice.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD"
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.isPaid 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.isDelivered 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {order.isDelivered ? "Delivered" : "Processing"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              to={`/order/${order._id}`}
                              className="text-[#776B5D] hover:text-[#5D534A] transition-colors"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;