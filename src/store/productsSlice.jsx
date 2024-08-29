import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  favorites: [],
  filteredProducts: [],
  categories: [],
  loading: true,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      const categories = Array.from(
        new Set(action.payload.map((product) => product.category.name))
      );
      state.categories = categories;
      state.loading = false;
    },
    addFavorite: (state, action) => {
      const product = action.payload;
      if (!state.favorites.some((fav) => fav.id === product.id)) {
        state.favorites.push(product);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (fav) => fav.id !== action.payload
      );
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      state.filteredProducts = state.products;
    },
    filterProductsByCategory: (state, action) => {
      if (action.payload === "All") {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          (product) => product.category.name === action.payload
        );
      }
    },
    filterProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    showAllProducts: (state) => {
      state.filteredProducts = state.products;
    },
  },
});

export const {
  setProducts,
  addFavorite,
  filterProducts,
  removeFavorite,
  deleteProduct,
  filterProductsByCategory,
  showAllProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
