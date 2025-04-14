import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadFile } from "../../components/UploadFile";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    brand: "",
    stock: 0,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        productData.append(key, value);
        console.log(key, value); // Verify stock is logged
      });
      console.log("productData:",productData);
      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} created successfully`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    try {
      const res = await UploadFile(file);
      toast.success("Image uploaded successfully");
      setFormData({ ...formData, image: res.url });
      setImageUrl(res.url);
      console.log(res.url);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminMenu />
          
          <div className="md:w-3/4 py-6">
            <h1 className="text-2xl font-bold text-[#3A3632] mb-6">Create Product</h1>

            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#5D534A] mb-2">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-[#EBE3D5] rounded-lg p-4 text-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto mb-4 rounded-lg"
                    />
                  ) : (
                    <div className="py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-[#B0A695]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-[#5D534A]">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-[#EBE3D5] text-[#5D534A] px-4 py-2 rounded-lg hover:bg-[#D9CDC1] transition-colors"
                  >
                    {imageUrl ? "Change Image" : "Select Image"}
                  </label>
                </div>
              </div>

              {/* Product Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      name="stock"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D534A] mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D534A] mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#776B5D] text-white rounded-lg hover:bg-[#5D534A] transition-colors"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;