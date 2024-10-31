import Link from "next/link";

const VerifyEmail = () => (
	<div className="flex flex-col items-center justify-center min-h-screen">
		<h1 className="text-2xl font-semibold">Verify Your Email</h1>
		<p className="my-4">A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.</p>
		<Link legacyBehavior href="/dashboard">
			<a className="text-blue-600">Return to Dashboard</a>
		</Link>
	</div>
);

export default VerifyEmail;