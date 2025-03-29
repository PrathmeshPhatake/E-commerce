import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[4rem]">
      <h1 className=" ml-[1rem] mt-[3rem] text-4xl font-bold text-black bg-white px-6 z-10 inline-block">
        FAVORITE PRODUCTS
      </h1>
   

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
