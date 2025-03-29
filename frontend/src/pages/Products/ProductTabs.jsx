import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F9F7F5] p-6 rounded-lg shadow-sm">
      {/* Tab Navigation */}
      <section className="md:w-1/4 mb-6 md:mb-0">
        <div className="space-y-2">
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeTab === 1
                ? "bg-[#776B5D] text-white"
                : "bg-[#F3EEEA] text-[#5D534A] hover:bg-[#EBE3D5]"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Write Your Review
          </button>
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeTab === 2
                ? "bg-[#776B5D] text-white"
                : "bg-[#F3EEEA] text-[#5D534A] hover:bg-[#EBE3D5]"
            }`}
            onClick={() => handleTabClick(2)}
          >
            All Reviews
          </button>
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeTab === 3
                ? "bg-[#776B5D] text-white"
                : "bg-[#F3EEEA] text-[#5D534A] hover:bg-[#EBE3D5]"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Related Products
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="md:w-3/4 md:pl-8">
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="mb-6">
                  <label htmlFor="rating" className="block text-lg font-medium text-[#5D534A] mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg focus:ring-2 focus:ring-[#B0A695] focus:border-[#B0A695] text-[#5D534A]"
                  >
                    <option value="">Select Rating</option>
                    <option value="1">⭐ (Inferior)</option>
                    <option value="2">⭐⭐ (Decent)</option>
                    <option value="3">⭐⭐⭐ (Great)</option>
                    <option value="4">⭐⭐⭐⭐ (Excellent)</option>
                    <option value="5">⭐⭐⭐⭐⭐ (Exceptional)</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-lg font-medium text-[#5D534A] mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg focus:ring-2 focus:ring-[#B0A695] focus:border-[#B0A695] text-[#5D534A]"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="w-full bg-[#776B5D] hover:bg-[#5D534A] text-white py-3 px-6 rounded-lg transition-colors font-medium"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 bg-[#F3EEEA] rounded-lg">
                <p className="text-[#5D534A] mb-4">
                  Please sign in to write a review
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-[#776B5D] hover:bg-[#5D534A] text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-[#5D534A]">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <strong className="text-[#3A3632] block">{review.name}</strong>
                      <Ratings value={review.rating} />
                    </div>
                    <p className="text-[#8C7D6D] text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-[#5D534A]">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div>
            <h3 className="text-xl font-medium text-[#5D534A] mb-6">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {!data ? (
                <Loader />
              ) : (
                data.map((product) => (
                  <div key={product._id} className="bg-white  rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <SmallProduct product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;