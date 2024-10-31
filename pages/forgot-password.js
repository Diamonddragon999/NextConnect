import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { account } from "../utils/appwrite"; // Import Appwrite client setup

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      setMessage("Recovery email sent! Please check your inbox.");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>Forgot Password | NextConnect</title>
      </Head>
      <main className='w-full flex items-center justify-center min-h-[100vh]'>
        <div className='w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md'>
          <h2 className='text-2xl font-medium mb-6 text-center'>
            Recover Your Password
          </h2>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <label htmlFor='email'>Email address</label>
            <input
              type='email'
              name='email'
              className='border px-4 py-2 mb-3 rounded-md w-full'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type='submit'
              className='bg-blue-600 p-3 font-medium hover:bg-blue-700 mb-3 rounded-md text-white'
            >
              Send Recovery Email
            </button>
          </form>
          {message && <p className='text-center mt-3'>{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
