import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { account, db, storage } from "../utils/appwrite";

const VerifiedPage = () => {
    const router = useRouter();
    const [status, setStatus] = useState('Verifying...');
    
    useEffect(() => {
        const verifyEmail = async () => {
            const { userId, secret } = router.query;

            if (userId && secret) {
                try {
                    await account.updateVerification(userId, secret);
                    setStatus('Email verified successfully! 🎉 Redirecting to dashboard...');
                    
                    // Redirect to dashboard after verification is complete
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 3000); // 3-second delay before redirecting
                } catch (error) {
                    console.error('Verification failed:', error.message);
                    setStatus('Verification failed. The link may have expired or is invalid.');
                }
            }
        };
        
        verifyEmail();
    }, [router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-semibold text-blue-600">Email Verification</h1>
                <p className="mt-4 text-gray-700">{status}</p>
            </div>
        </div>
    );
};

export default VerifiedPage;
