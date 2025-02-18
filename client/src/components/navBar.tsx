import React, { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { User, Wallet } from "../../types";
import { useUserWallet } from "../hooks/useUserWallet";

interface NavbarProps {
  user: User | null;
  wallet: Wallet | null;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserWallet();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className=" mx-auto px-6 md:px-20 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              Walto<span className="text-blue-500">.</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => alert("Navigate to Wallet Dashboard")}
              className="text-neutral-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
            >
            @{user?.username}  
            </button>
            <button
             onClick={() => logout()}
              className="text-neutral-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-neutral-700 hover:text-blue-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => alert("Navigate to Wallet Dashboard")}
              className="block text-neutral-700 hover:text-blue-500 px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              @{user?.username}             
            </button>
        
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;