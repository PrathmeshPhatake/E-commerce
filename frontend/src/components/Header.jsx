import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex flex-col">
      {/* Heading with decorative borders */}
      <div className="relative px-28 mb-8">
        {/* Border before */}
        <div className="absolute left-24 right-24 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
        
        {/* Main heading */}
        <div className="relative flex justify-center">
          <h1 className="text-4xl font-bold text-black bg-white px-6 z-10 inline-block">
            Top Trending Products
          </h1>
        </div>
        
        {/* Border after */}
        <div className="absolute left-24 right-24 bottom-1/4 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      </div>

      {/* Horizontal row of SmallProduct components */}
      <div className="flex  py-4 space-x-4 px-4">
        {data.map((product) => (
          <div key={product._id} className="flex-shrink-0">
            <SmallProduct product={product} />
          </div>
        ))}
      </div>

      {/* ProductCarousel placed below
      <div className="mt-8 px-24">
        <ProductCarousel />
      </div> */}
    </div>
  );
};

export default Header;