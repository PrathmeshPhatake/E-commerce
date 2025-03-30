import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import img1 from "../../Public/img1.webp"
import img2 from "../../Public/img2.webp"
import img3 from "../../Public/img3.webp"
import SimpleImageSlider from "react-simple-image-slider";
import CategoryHome from "./Category/CategoryHome.jsx";
const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  // Slider images
  const images = [{ url: img1 }, { url: img2 }, { url: img3 }]

  const shouldRenderSlider = !keyword && images?.length > 0;

  return (
    <>
      {shouldRenderSlider && (
        <>
           <div className="flex justify-center mt-4 mb-8">
            <SimpleImageSlider
              width="90%"
              height={400}
              images={images}  // Correct prop name for react-simple-image-slider
              // showBullets={true}
              // showNavs={true}
              autoPlay={true}
              autoPlayDelay={4}
              slideDuration={0.5}
            />
          </div>
          <Header />

        </>
      )}
      <div>
        <CategoryHome/>
      </div>
      {/* Rest of your component remains the same */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {/* {isError?.data.message || isError.error}  */}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem] font-bold text-black bg-white px-6 z-10 inline-block">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;