import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 text-white shadow-md transition-all duration-300 ${scrolled ? 'bg-black/90 py-2' : 'bg-black py-4'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Zpacart logo */}
        <div className="w-1/3">
          <Link 
            to="/" 
            className="text-2xl font-bold font-quicksand hover:text-gray-300 transition-colors"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Zapcart
          </Link>
        </div>

        {/* Center navigation links with increased spacing */}
        <div className="flex justify-center space-x-12 w-1/3">
          <Link
            to="/"
            className="flex flex-col items-center hover:text-gray-300 transition-colors group"
          >
            <AiOutlineHome size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">HOME</span>
          </Link>

          <Link
            to="/shop"
            className="flex flex-col items-center hover:text-gray-300 transition-colors group"
          >
            <AiOutlineShopping size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">SHOP</span>
          </Link>

          <Link
            to="/favorite"
            className="flex flex-col items-center hover:text-gray-300 transition-colors relative group"
          >
            <FaHeart size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">FAVORITES</span>
            <FavoritesCount />
          </Link>
        </div>

        {/* Right side - cart and profile icon */}
        <div className="flex justify-end items-center space-x-6 w-1/3">
          <Link to="/cart" className="relative group">
            <AiOutlineShoppingCart 
              size={24} 
              className="hover:text-gray-300 group-hover:scale-110 transition-transform" 
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs text-white bg-pink-500 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white focus:outline-none group"
            >
              {userInfo ? (
                <div className="flex items-center">
                  <AiOutlineUser 
                    size={24} 
                    className="hover:text-gray-300 group-hover:scale-110 transition-transform" 
                  />
                  {!scrolled && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-1 ${
                        dropdownOpen ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center hover:text-gray-300 group"
                >
                  <AiOutlineLogin 
                    className="mr-1 group-hover:scale-110 transition-transform" 
                    size={20} 
                  />
                  <span>LOGIN</span>
                </Link>
              )}
            </button>

            {dropdownOpen && userInfo && (
              <ul
                className={`absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg z-50 ${
                  !userInfo.isAdmin ? "top-10" : "top-10"
                }`}
              >
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categorylist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;