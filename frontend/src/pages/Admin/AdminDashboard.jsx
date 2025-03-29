import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7days");

  const [state, setState] = useState({
    options: {
      chart: {
        type: "area",
        background: "transparent",
        foreColor: "#5D534A",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: true
          }
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.1
        }
      },
      theme: {
        mode: "light"
      },
      colors: ["#8C7D6D"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      title: {
        text: "Sales Performance",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#3A3632",
          fontFamily: "'Inter', sans-serif"
        }
      },
      grid: {
        borderColor: "rgba(176, 166, 149, 0.2)",
        strokeDashArray: 4,
        padding: {
          top: 20,
          right: 20,
          bottom: 0,
          left: 20
        }
      },
      markers: {
        size: 5,
        colors: ["#8C7D6D"],
        strokeWidth: 0,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#5D534A",
            fontFamily: "'Inter', sans-serif"
          }
        },
        labels: {
          style: {
            colors: "#5D534A",
            fontFamily: "'Inter', sans-serif"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: "Revenue ($)",
          style: {
            color: "#5D534A",
            fontFamily: "'Inter', sans-serif"
          }
        },
        min: 0,
        labels: {
          style: {
            colors: "#5D534A",
            fontFamily: "'Inter', sans-serif"
          },
          formatter: (value) => `$${value.toLocaleString()}`
        }
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif"
        },
        theme: "light",
        y: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      }
    },
    series: [{ name: "Revenue", data: [] }]
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Revenue", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-[#F9F7F5] font-sans">
      <div className="flex flex-col md:flex-row">
        <AdminMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 md:p-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3A3632]">Dashboard Overview</h1>
              <p className="text-[#8C7D6D] mt-1">Track and analyze your store performance</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button 
                onClick={() => setTimeRange("7days")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === "7days" ? "bg-[#776B5D] text-white" : "bg-white text-[#5D534A] border border-[#EBE3D5]"}`}
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => setTimeRange("30days")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === "30days" ? "bg-[#776B5D] text-white" : "bg-white text-[#5D534A] border border-[#EBE3D5]"}`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#EBE3D5] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8C7D6D]">Total Revenue</p>
                  <h2 className="text-2xl font-bold text-[#3A3632] mt-1">
                    {loadingSales ? (
                      <Loader size="small" />
                    ) : (
                      `$${(sales?.totalSales || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                    )}
                  </h2>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    12.5% from last period
                  </p>
                </div>
                <div className="bg-[#F3EEEA] text-[#776B5D] p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#EBE3D5] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8C7D6D]">Total Customers</p>
                  <h2 className="text-2xl font-bold text-[#3A3632] mt-1">
                    {loadingCustomers ? (
                      <Loader size="small" />
                    ) : (
                      (customers?.length || 0).toLocaleString()
                    )}
                  </h2>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    8.3% from last period
                  </p>
                </div>
                <div className="bg-[#F3EEEA] text-[#776B5D] p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#EBE3D5] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8C7D6D]">Total Orders</p>
                  <h2 className="text-2xl font-bold text-[#3A3632] mt-1">
                    {loadingOrders ? (
                      <Loader size="small" />
                    ) : (
                      (orders?.totalOrders || 0).toLocaleString()
                    )}
                  </h2>
                  <p className="text-xs text-red-600 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    2.1% from last period
                  </p>
                </div>
                <div className="bg-[#F3EEEA] text-[#776B5D] p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#EBE3D5] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#3A3632]">Sales Analytics</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-[#F3EEEA] text-[#776B5D] rounded-lg">Daily</button>
                <button className="px-3 py-1 text-sm bg-[#776B5D] text-white rounded-lg">Weekly</button>
                <button className="px-3 py-1 text-sm bg-[#F3EEEA] text-[#776B5D] rounded-lg">Monthly</button>
              </div>
            </div>
            <Chart
              options={state.options}
              series={state.series}
              type="area"
              height={350}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#EBE3D5] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#3A3632]">Recent Orders</h2>
              <button className="text-sm text-[#776B5D] hover:text-[#5D534A] transition-colors">
                View All
              </button>
            </div>
            <OrderList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;