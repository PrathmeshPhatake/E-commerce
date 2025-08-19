import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const observer = useRef();
  const {
    data: productData,
    isLoading,
    isError,
    isFetching
  } = useAllProductsQuery(page);
  
  // Track if we're loading more (not initial load)
  const isLoadingMore = isFetching && page > 1;

  // Intersection Observer callback
  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && productData?.hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 } // Trigger when 10% of element is visible
      );
      
      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingMore, productData?.hasMore]
  );

  // Reset to page 1 when component mounts
  useEffect(() => {
    setPage(1);
  }, []);

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#776B5D]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-[#F3EEEA] text-[#9a662c] rounded-lg">
        ⚠️ Error loading products. Try refreshing the page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EEEA] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="mb-6 p-4 bg-[#EBE3D5] rounded-lg">
              <h1 className="text-2xl font-bold text-[#776B5D]">
                All Products ({productData?.totalProducts || 0})
              </h1>
            </div>

            <div className="space-y-6">
              {productData?.products?.map((product, index) => {
                // Only attach ref to the last product
                if (index === productData.products.length - 1) {
                  return (
                    <Link
                      key={product._id}
                      to={`/admin/product/update/${product._id}`}
                      className="block p-4 bg-white rounded-lg border border-[#EBE3D5] hover:shadow-md transition-shadow"
                      ref={lastProductElementRef}
                    >
                      <ProductItem product={product} />
                    </Link>
                  );
                }
                return (
                  <Link
                    key={product._id}
                    to={`/admin/product/update/${product._id}`}
                    className="block p-4 bg-white rounded-lg border border-[#EBE3D5] hover:shadow-md transition-shadow"
                  >
                    <ProductItem product={product} />
                  </Link>
                );
              })}

              {isLoadingMore && (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#776B5D]"></div>
                </div>
              )}

              {!productData?.hasMore && productData?.products?.length > 0 && (
                <div className="text-center p-4 text-[#776B5D]">
                  You've reached the end of the product list
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted product item component for better readability
const ProductItem = ({ product }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <img
      src={product.image}
      alt={product.name}
      className="w-full sm:w-40 h-40 object-cover rounded-lg"
    />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h5 className="text-lg font-bold text-[#776B5D]">{product.name}</h5>
        <p className="text-xs text-[#B0A695]">
          {moment(product.createdAt).format("MMMM Do YYYY")}
        </p>
      </div>
      <p className="mt-2 text-sm text-[#776B5D] line-clamp-3">
        {product.description}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-[#9a662c]">
        ₹{product.price}
        </span>
        <Link
          to={`/admin/product/update/${product._id}`}
          className="px-4 py-2 bg-[#B0A695] hover:bg-[#776B5D] text-white rounded-lg transition-colors flex items-center gap-1"
        >
          Update
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

export default AllProducts;