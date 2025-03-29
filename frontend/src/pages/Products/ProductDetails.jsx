import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imgRef = useRef(null);
  const zoomRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [zoom, setZoom] = useState({
    show: false,
    posX: 0,
    posY: 0,
  });

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoom({
      show: true,
      posX: x,
      posY: y,
    });

    // Position the zoom lens
    const lensSize = 150;
    const lensX = Math.max(0, Math.min(e.clientX - left - lensSize/2, width - lensSize));
    const lensY = Math.max(0, Math.min(e.clientY - top - lensSize/2, height - lensSize));
    
    zoomRef.current.style.left = `${lensX}px`;
    zoomRef.current.style.top = `${lensY}px`;
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleMouseLeave = () => {
    setZoom(prev => ({ ...prev, show: false }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully", {
        className: "bg-[#3A3632] text-[#F3EEEA]",
        progressClassName: "bg-[#8C7D6D]"
      });
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message, {
        className: "bg-[#F3EEEA] text-[#5D534A]",
        progressClassName: "bg-[#B0A695]"
      });
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
    toast.success(`${product.name} added to cart`, {
      className: "bg-[#3A3632] text-[#F3EEEA]",
      progressClassName: "bg-[#8C7D6D]"
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center text-[#5D534A] hover:text-[#776B5D] mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Product Images */}
              <div className="lg:w-1/2 relative">
                <div 
                  className="relative bg-white rounded-xl shadow-md overflow-hidden border border-[#EBE3D5] mb-4"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  ref={imgRef}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                  <div 
                    ref={zoomRef}
                    className="absolute pointer-events-none border-2 border-white rounded-full overflow-hidden shadow-lg"
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: '200% 200%',
                      zIndex: 10,
                      transform: 'translateZ(0)',
                      display: zoom.show ? 'block' : 'none',
                    }}
                  />
                  <HeartIcon product={product} className="absolute top-4 right-4 z-10" />
                  {product.countInStock === 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2">
                <h1 className="text-3xl font-bold text-[#3A3632] mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>

                <p className="text-4xl font-bold text-[#776B5D] mb-6">${product.price.toFixed(2)}</p>

                <p className="text-[#5D534A] mb-8">{product.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#F3EEEA] p-4 rounded-lg">
                    <div className="flex items-center text-[#5D534A]">
                      <FaStore className="mr-2" />
                      <span className="font-medium">Brand:</span>
                      <span className="ml-1">{product.brand}</span>
                    </div>
                  </div>
                  <div className="bg-[#F3EEEA] p-4 rounded-lg">
                    <div className="flex items-center text-[#5D534A]">
                      <FaClock className="mr-2" />
                      <span className="font-medium">Added:</span>
                      <span className="ml-1">{moment(product.createAt).fromNow()}</span>
                    </div>
                  </div>
                  <div className="bg-[#F3EEEA] p-4 rounded-lg">
                    <div className="flex items-center text-[#5D534A]">
                      <FaBox className="mr-2" />
                      <span className="font-medium">Stock:</span>
                      <span className="ml-1">{product.countInStock}</span>
                    </div>
                  </div>
                  <div className="bg-[#F3EEEA] p-4 rounded-lg">
                    <div className="flex items-center text-[#5D534A]">
                      <FaShoppingCart className="mr-2" />
                      <span className="font-medium">SKU:</span>
                      <span className="ml-1">{product._id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>

                {product.countInStock > 0 && (
                  <div className="flex items-center mb-8">
                    <span className="text-[#5D534A] font-medium mr-4">Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border border-[#EBE3D5] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#B0A695]"
                    >
                      {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${product.countInStock === 0 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-[#776B5D] hover:bg-[#5D534A] text-white"}`}
                >
                  {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;