// pages/scan.js
import { useState } from "react";
import { db } from "./appwrite"; // Adjust this import based on your project structure
import { ID } from "appwrite";
import { toast } from "react-toastify";
import QrReader from "react-qr-reader";

const ScanPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleScan = async (data) => {
        if (data) {
            setLoading(true);
            setMessage("");

            // Assuming data is in the format 'passcode-eventtitle'
            const [passcode, eventTitle] = data.split('-');

            try {
                // Fetch the event document by title (or passcode, depending on your setup)
                const response = await db.listDocuments(
                    process.env.NEXT_PUBLIC_DB_ID,
                    process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
                    [Query.equal("title", eventTitle)] // Change this query as needed
                );

                // Check if the event exists and if the passcode is valid
                if (response.documents.length > 0) {
                    const eventDoc = response.documents[0];
                    const attendees = eventDoc.attendees.map(attendee => JSON.parse(attendee));

                    // Check if the passcode matches any attendee's ID
                    const isValid = attendees.some(attendee => attendee.id === passcode);

                    if (isValid) {
                        setMessage("Valid QR Code! 🎉");
                    } else {
                        setMessage("Invalid QR Code ❌");
                    }
                } else {
                    setMessage("Event not found ❌");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                setMessage("Error fetching event. Please try again.");
            }

            setLoading(false);
        }
    };

    const handleError = (err) => {
        console.error(err);
        setMessage("Error scanning QR Code. Please try again.");
    };

    return (
        <div>
            <h1>Scan QR Code</h1>
            {loading && <p>Loading...</p>}
            <QrReader
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            {message && <p>{message}</p>}
        </div>
    );
};

export default ScanPage;
