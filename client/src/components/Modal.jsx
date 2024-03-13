import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Modal({ setShowModal }) {
  const [emails, setEmails] = useState({ email1: "", email2: "", email3: "" });
  const [error, setError] = useState(null);

  function handleChange({ target }) {
    const { name, value } = target;
    setEmails((prev) => ({ ...prev, [name]: value }));
  }
//funciton to submit form for updating emails and creating alert
  async function handleSubmit(event) {
    event.preventDefault();   
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch("https://weather-app-rcwz.onrender.com/emails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emails),
      });
  
      if (res.ok) {
        setError("Mail Alert Created!")
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      setError("An unexpected error occurred");
    }
  }
 //framer motion animation options
  const modalVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: 100, opacity: 0 },
  };

  return (
    <motion.div
      className="fixed top-0 bg-gradient-to-r from-cyan-500 to-blue-500 w-full h-full"
      variants={modalVariants}
      initial="closed"
      animate="open"
    >
      <button
        className="text-white hover:text-yellow-200 mt-10"
        onClick={() => {
          setShowModal(false);
        }}
      >
        X
      </button>
      <form onSubmit={handleSubmit}>
        <p className="text-yellow-200 m-10">
          We will send weather updates every day at 12 PM except on Sundays
        </p>
        <input
          type="email"
          name="email1"
          value={emails.email1}
          onChange={handleChange}
          className="m-2 rounded-md"
          required
        />
        <br />
        <input
          type="email"
          name="email2"
          value={emails.email2}
          onChange={handleChange}
          className="m-2 rounded-md"
          required
        />
        <br />
        <input
          type="email"
          name="email3"
          value={emails.email3}
          onChange={handleChange}
          className="m-2 rounded-md"
          required
        />
        <br />
        <button
          type="submit"
          className="bg-white px-1 rounded-md hover:bg-blue-800 hover:text-white m-5"
        >
          Submit
        </button>
        {error && <p>{error}</p>}
      </form>
    </motion.div>
  );
}
