import React from "react";
import { Link } from "react-router-dom";
import { BiShoppingBag } from "react-icons/bi";
import { useSelector } from "react-redux";
const HeaderNavbar = () => {
  const { cart } = useSelector((state) => state.cart);
  return (
    <div>
      <header class="text-gray-600 body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
           
            <span class="ml-3 text-xl">
              <Link to={"/"}>Firebase Demo Project</Link>
            </span>
          </a>
          <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center"></nav>
          
        </div>
      </header>
    </div>
  );
};

export default HeaderNavbar;
