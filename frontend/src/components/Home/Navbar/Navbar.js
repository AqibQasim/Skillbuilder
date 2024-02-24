import React from "react";
import "./Navbar.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return(
  <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
  <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
    <Link to="/" ><img src={logo} className="w-24" alt="SkillBuilder Logo" /></Link>
  </a>
  <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <Link to="/signup" className="no-underline"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2 text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</button></Link>
      <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
      <li>
        <Link to="/" className="no-underline"><p className="block border border-gray py-2 px-3 text-black rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</p></Link>
      </li>
      <li>
        <Link to="/courses" className="no-underline"><a href="#" className="no-underline block py-2 px-3 border border-gray text-black hover rounded md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Courses</a></Link>
      </li>
      <li>
        <Link to="/about" className="no-underline"><p className="no-underline block py-2 px-3 border border-gray text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About us</p></Link>
      </li>
      <li>
        <Link to="/contact" className="no-underline"><p className="no-underline block py-2 px-3 border border-gray text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact us</p></Link>
      </li>
    </ul>
  </div>
  </div>
</nav>
  );
};
export default Navbar;