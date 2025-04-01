import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  // State
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  // Mutations
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);
  console.log("category:",category);
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, { position: toast.POSITION.TOP_RIGHT });
      } else {
        toast.success(`Product updated successfully`, { 
          position: toast.POSITION.TOP_RIGHT 
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Update failed. Try again.", { 
        position: toast.POSITION.TOP_RIGHT 
      });
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm("Delete this product permanently?");
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" deleted`, { 
        position: toast.POSITION.TOP_RIGHT 
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.", { 
        position: toast.POSITION.TOP_RIGHT 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EEEA] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {/* <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D5]">
              <AdminMenu />
            </div>
          </div> */}

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-6 p-4 bg-[#EBE3D5] rounded-lg">
              <h1 className="text-2xl font-bold text-[#776B5D]">
                Update Product
              </h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D5]">
              {/* Image Upload */}
              <div className="mb-6">
                {image && (
                  <div className="mb-4 text-center">
                    <img
                      src={image}
                      alt="product"
                      className="mx-auto max-h-60 object-contain rounded-lg"
                    />
                  </div>
                )}
                <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                  Product Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="block w-full text-sm text-[#776B5D] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#B0A695] file:text-white hover:file:bg-[#776B5D] transition-colors"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D] focus:ring-1 focus:ring-[#B0A695] focus:border-[#B0A695]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Price
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D] focus:ring-1 focus:ring-[#B0A695]"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D]"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D]"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D]"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                    Category
                  </label>
                  <select
                    className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    // console.log()
                  >
                    
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-[#776B5D]">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-[#EBE3D5] rounded-lg bg-white text-[#776B5D]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-[#B0A695] hover:bg-[#776B5D] text-white rounded-lg transition-colors font-medium"
                >
                  Update Product
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors font-medium"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;