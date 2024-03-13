import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    email_Id: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  //for framer motion animation
  const signupVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100vw", opacity: 0 },
  };

  function handleChange({ target }) {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  //funciton to submit form for login
  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("passwords didn't match");
      return;
    }
    if (formData.password.length < 8) {
      setMessage("password must be at least 8 character long!");
      return;
    }
    setMessage("");
    console.log(formData);
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setMessage("Account created, Now please login..");
        window.location.href = '/login';
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <motion.div
      className="h-full w-full text-center"
      variants={signupVariants}
      initial="closed"
      animate="open"
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Navbar />
      <h1 className="font-black text-2xl">Welcome to Today's Weather!</h1>
      <p className="text-xl text-yellow-300 my-5">
        Please create your account, It's easy
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email_Id}
          onChange={handleChange}
          name="email_Id"
          placeholder="enter your email"
          required
          className="my-2 w-1/4 rounded-md p-2"
        />
        <br />
        <input
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="enter your password"
          required
          className="my-2 w-1/4 rounded-md p-2"
        />
        <br />
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          placeholder="confirmPassword"
          required
          className="my-2 w-1/4 rounded-md p-2"
        />
        <br />
        <button className="mt-5 bg-white p-2 px-4 rounded-md hover:bg-blue-800 hover:text-white">
          Create Account
        </button>
      </form>
      <p>{message}</p>
    </motion.div>
  );
}