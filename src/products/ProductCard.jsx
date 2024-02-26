import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../cart/cartSlice";
import toast, { Toaster } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";

const ProductCard = (product) => {
  // console.log("Products", product);
  const dispatch = useDispatch();

  const success = () => toast.success("Your Item added in your Bucket");

  return (
    <>
      <div className="notificationContainer">
        <p> </p>{" "}
      </div>{" "}
      <Toaster position="top-center" reverseOrder={true} />
      <div style={{ padding: "30px" }}>
        <div style={{ padding:"10px 30px", backgroundColor:"blue", color:"white"}}>
        
          <div>
            <a href="#">
              <span class="title" style={{ display: "none" }}></span>
            </a>
            <div className="desc1">
              <p style={{ marginTop: "60px" }}>{product.name}</p>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
