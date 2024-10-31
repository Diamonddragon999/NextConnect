import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdCancel } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import Loading from "../../components/Loading";
import DatePicker from "react-datepicker";
import { db } from "../../utils/appwrite"; // Import Appwrite db instance
import { updateEvent } from "../../utils/functions"; // Function to update event in Appwrite
import { checkAuthStatus } from "../../utils/functions"; // Check authentication status
import Footer  from '../../components/Footer';
import Nav from '../../components/Nav';

const EditEvent = () => {
    const [user, setUser] = useState({});
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [description, setDescription] = useState("");
    const [note, setNote] = useState("");
    const [flier, setFlier] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { eventID } = router.query; // Extract event ID from URL

    // Fetch and authenticate user, load event data
    useEffect(() => {
        const authenticateAndFetchEvent = async () => {
            await checkAuthStatus(setUser, setLoading, router);
            if (eventID) {
                try {
                    const event = await db.getDocument(
                        process.env.NEXT_PUBLIC_DB_ID,
                        process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
                        eventID
                    );
                    setTitle(event.title);
                    setDate(new Date(event.date));
                    setTime(event.time);
                    setVenue(event.venue);
                    setDescription(event.description);
                    setNote(event.note);
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to fetch event data:", error);
                    setLoading(false);
                }
            }
        };
        authenticateAndFetchEvent();
    }, [eventID, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            title,
            date: date.toISOString(), // Convert date to ISO format
            time,
            venue,
            description,
            note,
        };

        await updateEvent(eventID, updatedData, router); // Update the event in Appwrite
    };

    if (loading) return <Loading title="Loading event data..." />;

    return (
        <div className="flex flex-col min-h-screen"><Nav />
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    
    <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Edit Event</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="title" className="font-semibold text-gray-700 mb-2">Title</label>
            <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none"
                required
            />

            <label htmlFor="venue" className="font-semibold text-gray-700 mb-2">Venue</label>
            <input
                name="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none"
                required
            />

            <label htmlFor="time" className="font-semibold text-gray-700 mb-2">Time</label>
            <input
                name="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none"
                required
            />

            <label htmlFor="date" className="font-semibold text-gray-700 mb-2">Date</label>
            <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none w-full"
            />

            <label htmlFor="description" className="font-semibold text-gray-700 mb-2">Event Description</label>
            <textarea
                name="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none"
            />

            <label htmlFor="note" className="font-semibold text-gray-700 mb-2">Note to Attendees</label>
            <textarea
                name="note"
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border py-2 px-4 rounded mb-4 focus:border-blue-500 focus:outline-none"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all duration-200 font-semibold"
            >
                Save Changes
            </button>
        </form>
    </div>
    <Footer />
</div>
</div>

    );
};

export default EditEvent;
