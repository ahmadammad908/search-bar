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
  const [loading, setLoading] = useState(false);

  const firestore = getFirestore();

  useEffect(() => {
    getProducts({ category });
  }, [category]);

  useEffect(() => {
    if (filteredProducts.length === 0) {
      getProducts({ category }); // Fetch all products from Redux when filteredProducts is empty
    }
  }, [filteredProducts, category, getProducts]);

  const searchFirestore = async (searchInput) => {
    setLoading(true);
    try {
      if (searchInput !== "") {
        const searchQuery = query(
          collection(firestore, "products"),
          where("name", "==", searchInput)
        );
        const searchSnapshot = await getDocs(searchQuery);
        const searchResults = searchSnapshot.docs.map((doc) => doc.data());
        console.log("Search Results:", searchResults);
        setFilteredProducts(searchResults);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error searching Firestore:", error);
    }
    setLoading(false);
  };

  const handleSearch = async (searchInput) => {
    await searchFirestore(searchInput);
  };

  // Adjusting productsToDisplay based on conditions
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
        <SearchBar onSearch={handleSearch} onClear={() => setFilteredProducts([])} reduxProducts={reduxProducts}/>
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
        {loading && <Loader />}
        {!loading &&
          (productsToDisplay.length === 0 ? (
            <div style={{ paddingTop: "80px" }}>
              <div style={{ fontSize: "20px", color: "red" }}>
                No products found.
              </div>
            </div>
          ) : (
            productsToDisplay.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))
          ))}
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch, onClear, reduxProducts }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    if (event.target.value === "") {
      // If search input becomes empty, trigger the onClear function
      onClear();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <>
    
    <form onSubmit={handleSearch}>
      <input
        style={{ padding: "20px" }}
        type="search"
        placeholder="Search by name"
        value={searchInput}
        onChange={handleSearchInputChange}
        list="products"
      />
      <datalist id="products" style={{background:"black"}}>
        {
          reduxProducts.map((product, i )=> (
            <>
            <option value={product.name} style={{color:"blue"}}></option>
            </>
          ))
        }
      </datalist>
      <button
        type="submit"
        style={{
          border: "2px solid red",
          padding: "10px",
          background: "red",
          color: "white",
          marginLeft: "10px",
        }}
      >
        Search
      </button>
    </form>
    </>
    
  );
};

export default Products;
