import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response.data; // { success: true, products: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategories();
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    filtered: [],
    categories: [],
    loading: false,
    error: null,
    searchQuery: "",
    selectedCategory: "All",
    priceRange: [0, 200000],
    minRating: 0,
    sortBy: "relevance",
    wishlist: [],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "All";
      state.priceRange = [0, 200000];
      state.minRating = 0;
      state.sortBy = "relevance";
    },
    toggleWishlist: (state, action) => {
      const id = action.payload;
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter((w) => w !== id);
      } else {
        state.wishlist.push(id);
      }
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.filtered = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setCategory,
  setPriceRange,
  setMinRating,
  setSortBy,
  resetFilters,
  toggleWishlist,
  setWishlist,
} = productSlice.actions;

export const selectProducts = (state) => state.products.filtered;
export const selectAllProducts = (state) => state.products.items;
export const selectWishlist = (state) => state.products.wishlist;
export const selectProductLoading = (state) => state.products.loading;

export default productSlice.reducer;
