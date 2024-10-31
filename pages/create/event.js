import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdCancel } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import AuthNav from "../../components/AuthNav";
import SideNav from "../../components/SideNav";
import Loading from "../../components/Loading";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { checkAuthStatus, createEvent } from "../../utils/functions"; 

const CreateEventPage = () => {
    const [user, setUser] = useState({});
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("12:00");
    const [venue, setVenue] = useState("");
    const [description, setDescription] = useState("");
    const [note, setNote] = useState("");
    const [flier, setFlier] = useState(null);
    const fileName = useRef();
    const [buttonClicked, setButtonClicked] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const authenticateUser = useCallback(() => {
        checkAuthStatus(setUser, setLoading, router);
    }, [router]);

    useEffect(() => {
        authenticateUser();
    }, [authenticateUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonClicked(true);

        // Crearea evenimentului
        const eventId = await createEvent(
            user.$id,
            title,
            date,
            time,
            venue,
            description,
            note,
            flier,
            router
        );

        // Redirectare sau altă logică după crearea evenimentului
        router.push(`/dashboard`); // Redirectare la pagina de detalii a evenimentului
    };

    //if (loading) return <Loading title='Authenticating...' />;

    return (
        <div className="flex flex-col min-h-screen">
            <AuthNav user={user} />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
                <Head>
                    <title>Create New Event | NextConnect</title>
                    <meta name="description" content="Create a new event on NextConnect" />
                    <link rel="icon" href="/images/favicon.ico" />
                </Head>
                <main className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                    <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
                        Create a New Event
                    </h2>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <label htmlFor="title" className="font-semibold text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            name="title"
                            type="text"
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <label htmlFor="venue" className="font-semibold text-gray-700 mb-2">
                            Venue
                        </label>
                        <input
                            name="venue"
                            type="text"
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            required
                        />

                        <label htmlFor="time" className="font-semibold text-gray-700 mb-2">
                            Time
                        </label>
                        <input
                            name="time"
                            type="time"
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />

                        <label htmlFor="date" className="font-semibold text-gray-700 mb-2">
                            Date
                        </label>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500 w-full"
                            required
                        />

                        <label htmlFor="description" className="font-semibold text-gray-700 mb-2">
                            Event Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <label htmlFor="note" className="font-semibold text-gray-700 mb-2">
                            Note to Attendees
                        </label>
                        <textarea
                            name="note"
                            rows="4"
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />

                        <label htmlFor="file" className="font-semibold text-gray-700 mb-2">
                            Event Flier (optional)
                        </label>
                        <input
                            type="file"
                            name="file"
                            ref={fileName}
                            onChange={(e) => setFlier(e.target.files[0])}
                            className="border py-2 px-4 rounded mb-4 focus:border-blue-500"
                            accept="image/png, image/jpeg"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all duration-200 font-semibold"
                        >
                            Create Event
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default CreateEventPage;
