import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import Input from "../components/input";
import Button from "../components/button";
import { useUserWallet } from "../hooks/useUserWallet";

const Register: React.FC = () => {
  const { register } = useUserWallet();
  
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // Added error state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const usernamePattern = /^[a-zA-Z0-9_-]+$/; // Alphanumeric, underscores, dashes only

    if (!formData.username.match(usernamePattern)) {
      setError("Username can only contain letters, numbers, underscores, and dashes. No spaces allowed.");
      return; // Stop submission if invalid
    }
    try {
      const success = await register(formData.username, formData.password); // Call register function
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError("Registration failed. Please try again."); // Handle error
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
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Register</h1>
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
            Register
          </Button>
        </form>
        <p className="mt-4 text-sm text-neutral-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;