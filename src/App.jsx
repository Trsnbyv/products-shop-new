import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Spin, Select } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast, Toaster } from "react-hot-toast";
import useAxios from "./hooks/useAxios";
import {
  addFavorite,
  removeFavorite,
  deleteProduct,
  filterProductsByCategory,
  showAllProducts,
  filterProducts,
} from "./store/productsSlice";
import "antd/dist/reset.css";
import "./App.css";

const { Search } = Input;
const { Option } = Select;

const App = () => {
  useAxios(import.meta.env.VITE_API_URL);
  const dispatch = useDispatch();
  const { products, favorites, filteredProducts, categories, loading } =
    useSelector((state) => state.products);

  const handleFavorite = (product) => {
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  const handleDelete = (productId) => {
    try {
      toast.success("Product deleted successfully!");
      setTimeout(() => {
        dispatch(deleteProduct(productId));
      }, 1000);
    } catch (error) {
      console.error("Failed to delete the product:", error);
      toast.error("Failed to delete the product.");
    }
  };

  const handleSearch = (value) => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    dispatch(filterProductsByCategory(filtered));
  };

  const handleCategoryChange = (value) => {
    dispatch(filterProductsByCategory(value));
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="flex justify-between mb-6">
        <Search
          placeholder="Search products"
          onSearch={handleSearch}
          className="w-1/4"
        />
        <Select
          allowClear
          defaultValue="All"
          onChange={handleCategoryChange}
          className="w-1/4"
        >
          <Option value="All">All</Option>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <div className="flex space-x-4">
          <Button onClick={() => dispatch(showAllProducts())}>
            All Products
          </Button>
          <Button onClick={() => dispatch(filterProducts(favorites))}>
            <HeartFilled /> ({favorites.length})
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin />
        </div>
      ) : (
        <ul className="flex justify-start flex-wrap gap-[37px]">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="flex flex-col w-[340px] shadow-lg text-center overflow-hidden rounded-[20px] hover:shadow-2xl duration-300"
            >
              <img
                alt={product.title}
                width={340}
                height={340}
                className="w-full mx-auto mb-3"
                src={product.images[0]}
              />
              <div className="p-3 text-left">
                <h3 className="text-[20px] font-semibold mb-3">
                  {product.title}
                </h3>
                <div className="h-[1px] bg-slate-500 mb-3"></div>
                <p className="mb-3">
                  {truncateDescription(product.description, 50)}
                </p>
                <p className="text-[18px] text-gray-500">
                  Price:{" "}
                  <span className="text-black font-semibold">
                    ${product.price}
                  </span>
                </p>
                <p className="text-gray-500 mb-3">
                  Created on:{" "}
                  <span className="text-black font-semibold">
                    {new Date(product.creationAt).toLocaleDateString()}
                  </span>
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => handleFavorite(product)}>
                    {favorites.some((fav) => fav.id === product.id) ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
