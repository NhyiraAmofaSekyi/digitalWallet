import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Added useNavigate
import Input from "../components/input";
import Button from "../components/button";
import { useUserWallet } from "../hooks/useUserWallet";

const SignIn: React.FC = () => {
  const { login } = useUserWallet();

  const [formData, setFormData] = useState({
    username: "", // Changed from 'name' to 'email' to match input type
    password: "",
  });
  const [error, setError] = useState(""); // Added error state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    setError("");
    try {
      const success = await login(formData.username, formData.password); // Use email instead of name
      if (success) {

        window.location.href = "/"; 

      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError("Invalid credentials. Please try again."); // Handle error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-neutral-50 p-4"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Sign In</h1>
        {error && ( // Error message display
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignIn;