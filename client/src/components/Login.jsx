import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email_Id: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const loginVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-50vw', opacity: 0 },
  };

  function handleChange({ target }) {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('Please Wait...!');
    try {
      const res = await fetch('https://weather-app-rcwz.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage('Login Successful!');
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
      if (res.status === 404) {
        setMessage('Invalid username or password');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <motion.div
      className="h-full w-full text-center"
      variants={loginVariants}
      initial="closed"
      animate="open"
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <h1 className="font-black pt-10 text-2xl">
        Welcome Back to Today's Weather!
      </h1>
      <p className="text-xl text-yellow-300 my-5">
        Please log in to your account
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email_Id}
          onChange={handleChange}
          name="email_Id"
          placeholder="Enter your email"
          required
          className="my-2 md:w-1/4 rounded-md p-2"
        />
        <br />
        <input
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="Enter your password"
          required
          className="my-2 md:w-1/4 rounded-md p-2"
        />
        <br />
        <button className="mt-5 bg-white p-2 px-4 rounded-md hover:bg-blue-800 hover:text-white">
          Log In
        </button>        
      </form>
      <p className='mt-5'>Don't have an account? Create one it is easy!</p>
      <button onClick={()=>navigate('/')} className="mt-5 bg-white p-2 px-4 rounded-md hover:bg-blue-800 hover:text-white">
          Create Account
        </button>
      <p className="animate-pulse mt-4 text-xl font-bold">{message}</p>
    </motion.div>
  );
}