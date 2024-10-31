// /pages/reset-password.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { account } from "../utils/appwrite"; // Ensure your Appwrite client is set up

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const router = useRouter();

	// Extract userId and secret from the query parameters
	const { userId, secret } = router.query;

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
			return;
		}

		try {
			// Use Appwrite's updateRecovery method to set the new password
			await account.updateRecovery(userId, secret, password, confirmPassword);
			setMessage("Password reset successful! Redirecting to login...");

			// Redirect to login after a short delay
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		} catch (error) {
			console.error(error);
			setMessage("An error occurred. Please try again.");
		}
	};

	return (
		<div>
			<Head>
				<title>Reset Password | NextConnect</title>
			</Head>
			<main className="w-full flex items-center justify-center min-h-[100vh]">
				<div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
					<h2 className="text-2xl font-medium mb-6 text-center">
						Reset Your Password
					</h2>
					<form onSubmit={handleSubmit} className="flex flex-col">
						<label htmlFor="password">New Password</label>
						<input
							type="password"
							name="password"
							className="border px-4 py-2 mb-3 rounded-md w-full"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<label htmlFor="confirmPassword">Confirm New Password</label>
						<input
							type="password"
							name="confirmPassword"
							className="border px-4 py-2 mb-3 rounded-md w-full"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-blue-600 p-3 font-medium hover:bg-blue-700 mb-3 rounded-md text-white"
						>
							Reset Password
						</button>
					</form>
					{message && <p className="text-center mt-3">{message}</p>}
				</div>
			</main>
		</div>
	);
};

export default ResetPassword;
