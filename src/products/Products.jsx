import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import useProducts from "./useProducts";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Products = () => {
  const { getProducts } = useProducts();
  const { products: reduxProducts } = useSelector((state) => state.products);

  const [category, setCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [searchError, setSearchError] = useState(false);

  const firestore = getFirestore();

  useEffect(() => {
    fetchProducts(); // Fetch products initially
  }, [category]); // Fetch products when category changes

  // Function to fetch products
  const fetchProducts = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      await getProducts({ category });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false); // Set loading to false when fetching is done
  };

  const searchFirestore = async (searchInput) => {
    setLoading(true); // Set loading to true while searching
    try {
      if (searchInput !== "") {
        const searchQuery = query(
          collection(firestore, "products"),
          where("name", ">=", searchInput),
          where("name", "<=", searchInput.toLowerCase() + "\uf8ff")
        );
        const searchSnapshot = await getDocs(searchQuery);
        const searchResults = searchSnapshot.docs.map((doc) => doc.data());
        console.log("Search Results:", searchResults);

        if (searchResults.length === 0) {
          setSearchError(true);
        } else {
          setSearchError(false);
          setFilteredProducts(searchResults);
        }
      } else {
        setSearchError(false);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error searching Firestore:", error);
    }
    setLoading(false); // Set loading to false when searching is done
  };

  const handleSearch = async (searchInput) => {
    await searchFirestore(searchInput);
  };

  let productsToDisplay = [];

  if (filteredProducts.length > 0) {
    productsToDisplay = filteredProducts;
  } else {
    productsToDisplay = reduxProducts;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <SearchBar onSearch={handleSearch} reduxProducts={reduxProducts} />
      </div>
      <div
        className="box"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "0px",
        }}
      >
        {loading ? ( // Display loader when loading is true
          <Loader />
        ) : (
          <div className="box" style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: "0px",
          }}>
            {searchError ? (
              <div style={{ paddingTop: "80px" }}>
                <div style={{ fontSize: "20px", color: "red" }}>
                  No results found.
                </div>
              </div>
            ) : (
              productsToDisplay.map((product, i) => (
                <ProductCard key={i} {...product} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch, reduxProducts }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    if (event.target.value === "") {
      onSearch(""); // Call onSearch with empty string to show all products
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <>
    <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            maxWidth: "400px", // Limit maximum width for larger screens
            marginBottom: "10px",
          }}
          type="search"
          placeholder="Search by name"
          value={searchInput}
          onChange={handleSearchInputChange}
          list="products"
        />
        <button
          type="submit"
          style={{
            border: "none",
            padding: "10px 20px",
            background: "#1877f2",
            color: "white",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            maxWidth: "400px", // Limit maximum width for larger screens
          }}
        >
          Search
        </button>
      </form>
      <datalist id="products">
        {reduxProducts.map((product, i) => (
          <option key={i} value={product.name} />
        ))}
      </datalist>
    </>
  );
};

export default Products;
