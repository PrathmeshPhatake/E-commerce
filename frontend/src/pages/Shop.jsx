import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [activeBrand, setActiveBrand] = useState(null);

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      const filteredProducts = filteredProductsQuery.data?.filter((product) => {
        return (
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
      });
      dispatch(setProducts(filteredProducts || []));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    setActiveBrand(brand);
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand || []));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    "All Brands",
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const resetFilters = () => {
    setPriceFilter("");
    setActiveBrand(null);
    dispatch(setChecked([]));
    dispatch(setProducts(filteredProductsQuery.data || []));
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h1 className="text-2xl font-bold text-[#5D534A] mb-6">Filters</h1>
              
              {/* Categories Filter */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#5D534A] mb-4 pb-2 border-b border-[#EBE3D5]">
                  Categories
                </h2>
                <div className="space-y-3">
                  {categories?.map((c) => (
                    <div key={c._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${c._id}`}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        checked={checked.includes(c._id)}
                        className="w-5 h-5 text-[#B0A695] rounded border-[#EBE3D5] focus:ring-[#B0A695]"
                      />
                      <label
                        htmlFor={`cat-${c._id}`}
                        className="ml-3 text-[#5D534A] hover:text-[#B0A695] cursor-pointer"
                      >
                        {c.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#5D534A] mb-4 pb-2 border-b border-[#EBE3D5]">
                  Brands
                </h2>
                <div className="space-y-3">
                  {uniqueBrands?.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="radio"
                        id={`brand-${brand}`}
                        name="brand"
                        onChange={() => handleBrandClick(brand === "All Brands" ? null : brand)}
                        checked={activeBrand === brand || (brand === "All Brands" && activeBrand === null)}
                        className="w-5 h-5 text-[#B0A695] border-[#EBE3D5] focus:ring-[#B0A695]"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-3 text-[#5D534A] hover:text-[#B0A695] cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#5D534A] mb-4 pb-2 border-b border-[#EBE3D5]">
                  Price Range
                </h2>
                <input
                  type="text"
                  placeholder="Enter max price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#5D534A] placeholder-[#B0A695]"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 bg-[#EBE3D5] text-[#5D534A] rounded-lg hover:bg-[#B0A695] hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5D534A]">
                {products?.length} {products?.length === 1 ? "Product" : "Products"}
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Loader />
                <p className="mt-4 text-[#5D534A]">No products match your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 py-2 px-6 bg-[#EBE3D5] text-[#5D534A] rounded-lg hover:bg-[#B0A695] hover:text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;