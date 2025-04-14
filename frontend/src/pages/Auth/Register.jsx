import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Featured products to display on registration page
  const featuredProducts = [
    {
      id: 1,
      name: "Galaxy Ultra Smartwatch",
      price: "$349",
      image: "https://images.unsplash.com/photo-1558433916-90a36b44753f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tag: "Trending"
    },
    {
      id: 2,
      name: "Thunderbolt 4K Monitor",
      price: "$599",
      image: "https://images.unsplash.com/photo-1546538915-a9e2c8a0c944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      tag: "Premium"
    },
    {
      id: 3,
      name: "Nova Wireless Keyboard",
      price: "$129",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
      tag: "Best Value"
    }
  ];

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password, isAdmin }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome to ZapCart! Enjoy your shopping experience");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Left Side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
            <img 
                src="https://res.cloudinary.com/dxor5y4pf/image/upload/v1744650553/ChatGPT_Image_Apr_14_2025_10_35_02_PM_ozqpwr.png" 
                alt="ZapCart Logo"
                className="h-32 w-32 mr-2"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                ZapCart
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-white text-center">
            Join ZapCart
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Create your account to unlock exclusive tech deals worldwide
          </p>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 p-3 border border-gray-700 rounded-lg w-full bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 border border-gray-700 rounded-lg w-full bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 border border-gray-700 rounded-lg w-full bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-3 border border-gray-700 rounded-lg w-full bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
                Register as admin
              </label>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-100 shadow-lg hover:shadow-blue-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Featured Products */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-6">
            Hot Tech Deals
          </h2>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-all group">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full mb-1">
                      {product.tag}
                    </span>
                    <h3 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-blue-400 font-bold">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto bg-gray-800 bg-opacity-70 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">
              Why Join ZapCart?
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Worldwide shipping with fast delivery
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exclusive members-only discounts
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 customer support for all products
              </li>
            </ul>
            <button className="mt-4 w-full py-2 bg-transparent border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              Explore More Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;