import { useReducer, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast, Toaster } from "react-hot-toast";
import useAxios from "./hooks/useAxios";
import "antd/dist/reset.css";
import "./App.css";

const { Search } = Input;

const initialState = {
  products: [],
  favorites: [],
  filteredProducts: [],
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
      };
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };
    case "DELETE_PRODUCT":
      const updatedProducts = state.products.filter(
        (product) => product.id !== action.payload
      );
      return {
        ...state,
        products: updatedProducts,
        filteredProducts: updatedProducts,
      };
    case "FILTER_PRODUCTS":
      return { ...state, filteredProducts: action.payload };
    case "SHOW_ALL_PRODUCTS":
      return { ...state, filteredProducts: state.products };
    default:
      return state;
  }
};

const App = () => {
  const { data, loading } = useAxios(import.meta.env.VITE_API_URL);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    if (savedProducts.length > 0) {
      dispatch({ type: "SET_PRODUCTS", payload: savedProducts });
    } else {
      dispatch({ type: "SET_PRODUCTS", payload: data });
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(state.products));
  }, [state.products]);

  const handleFavorite = (product) => {
    const isFavorite = state.favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      dispatch({ type: "REMOVE_FAVORITE", payload: product.id });
    } else {
      dispatch({ type: "ADD_FAVORITE", payload: product });
    }
  };

  const handleDelete = (productId) => {
    try {
      toast.success("Product deleted successfully!");
      setTimeout(() => {
        dispatch({ type: "DELETE_PRODUCT", payload: productId });
        const updatedProducts = state.products.filter(
          (product) => product.id !== productId
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      }, 1000);
    } catch (error) {
      console.error("Failed to delete the product:", error);
      toast.error("Failed to delete the product.");
    }
  };

  const handleSearch = (value) => {
    const filtered = state.products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    dispatch({ type: "FILTER_PRODUCTS", payload: filtered });
  };

  useEffect(() => {}, [state.filteredProducts]);

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
        <div className="flex space-x-4">
          <Button onClick={() => dispatch({ type: "SHOW_ALL_PRODUCTS" })}>
            All Products
          </Button>
          <Button
            onClick={() =>
              dispatch({ type: "FILTER_PRODUCTS", payload: state.favorites })
            }
          >
            <HeartFilled /> ({state.favorites.length})
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin />
        </div>
      ) : (
        <ul className="flex justify-start flex-wrap gap-[37px]">
          {state.filteredProducts.map((product) => (
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
                <p className="mb-3">{truncateDescription(product.description, 50)}</p>
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
                    {state.favorites.some((fav) => fav.id === product.id) ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )}
                  </Button>         
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500"
                    loading={loading}
                    key={product.id}
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
