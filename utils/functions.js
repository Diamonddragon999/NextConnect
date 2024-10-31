import { useState } from "react"; // Import useState
import { account, db, storage } from "./appwrite";
import { toast } from "react-toastify";
import { ID, Query } from "appwrite";
import emailjs from "@emailjs/browser";
import QRCode from "qrcode"; // Ensure QRCode is imported correctly

//👇🏻 generate random strings as ID
const generateID = () => Math.random().toString(36).substring(2, 24);

//👇🏻 extract file ID from the document
const extractIdFromUrl = (url) => {
    const regex = /files\/([^/]+)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
};

//👇🏻 alerts a success message
const successMessage = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

//👇🏻 alerts an error message
const errorMessage = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

//👇🏻 convert the date to human-readable form
export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", options);

    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    }

    const formattedDateWithSuffix = formattedDate.replace(/\d+/, day + suffix);

    return formattedDateWithSuffix;
};

// Function to generate QR code as a Base64 image
async function generateQrCodeBase64(passcode, eventtitle) {
    const qrData = `${passcode}-${eventtitle}`;
    try {
        const qrCodeBase64 = await QRCode.toDataURL(qrData);
        return qrCodeBase64;
    } catch (error) {
        console.error("Error generating QR code:", error);
    }
}

//format phoneNumber
export function formatPhoneNumber(input) {
    try {
        // Remove any non-digit characters from the input
        const cleaned = input.replace(/\D/g, '');

        // Extract the country code and the rest of the number
        const countryCode = cleaned.substring(0, 2); // First two digits
        const number = cleaned.substring(2); // Remaining digits

        // Format the phone number
        const formatted = `+${countryCode} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;

        return formatted;
    } catch (err) {
        return "N/A";
    };
}

// Send email via EmailJS with QR code in Base64 format
export const sendEmail = async (
    name,
    email,
    title,
    time,
    date,
    note,
    description,
    passcode,
    flier_url,
    setSuccess,
    setLoading
) => {
    try {
        setLoading(true);

        // Await the QR code Base64 result before sending
        const qrcodeBase64 = await generateQrCodeBase64(passcode, title);

        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
            {
                name,
                email,
                title,
                time,
                date: formatDate(date),
                note,
                description,
                passcode,
                qrcode: qrcodeBase64, // Attach the Base64 QR code
                flier_url
            },
            process.env.NEXT_PUBLIC_EMAIL_API_KEY
        );

        setLoading(false);
        setSuccess(true);
    } catch (error) {
        console.error("Email send error:", error);
        errorMessage(error.text || "Error sending email.");
        setSuccess(false);
        setLoading(false);
    }
};

//👇🏻 converts JSON string to JavaScript objects
export const parseJSON = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
};

//👇🏻 generate slug
export const createSlug = (sentence) => {
    let slug = sentence.toLowerCase().trim();
    slug = slug.replace(/[^a-z0-9]+/g, "-");
    slug = slug.replace(/^-+|-+$/g, "");
    return slug;
};

//👇🏻 Appwrite signUp function
//👇🏻 Appwrite signUp function
export const signUp = async (name, email, password, router) => {
    try {
        // Step 1: Create a new account
        await account.create(ID.unique(), email, password, name);
        successMessage("Account created! 🎉");

        // Step 2: Log the user in to gain required permissions
        await account.createEmailSession(email, password);

        // Step 3: Send verification email with redirect URL
        try {
            const redirectUrl = `${window.location.origin}/verified`; // Change "/verified" to the desired path after email verification
            await account.createVerification(redirectUrl);
            successMessage("Verification email sent! Please check your inbox.");
            router.push("/verify-email"); // Redirect to verify page
        } catch (verificationError) {
            console.error("Error sending verification email:", verificationError.message);
            errorMessage("Failed to send verification email. Please try again later.");
        }
    } catch (err) {
        console.error("Error creating account:", err.message);
        errorMessage("Check your network / User already exists ❌");
        router.push("/login"); // Optionally redirect or stay on page
    }
};

//👇🏻 Appwrite login function
export const logIn = async (email, setEmail, password, setPassword, router) => {
    try {
        await account.createEmailSession(email, password);
        successMessage(`Welcome back 🎉`);
        setEmail("");
        setPassword("");
        router.push("/dashboard");
    } catch (err) {
        errorMessage(err.message || "Invalid credentials ❌");
    }
};

//👇🏻 delete a ticket
export const deleteTicket = async (id) => {
	try {
		const getDoc = await db.getDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
			id
		);
		if (getDoc.flier_url === "https://google.com") {
			await db.deleteDocument(
				process.env.NEXT_PUBLIC_DB_ID,
				process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
				id
			);
		} else {
			const fileID = extractIdFromUrl(getDoc.flier_url);
			await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID, fileID);
			await db.deleteDocument(
				process.env.NEXT_PUBLIC_DB_ID,
				process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
				id
			);
		}
		successMessage("Ticket deleted! 🎉");
		location.reload();
	} catch (err) {
		//console.error(err); // Failure
		errorMessage("Action declined ❌");
	}
};


//👇🏻 Appwrite logout function
export const logOut = async (router) => {
    try {
        await account.deleteSession("current");
        router.push("/");
        successMessage("See ya later 🎉");
    } catch (err) {
        errorMessage("Encountered an error 😪");
    }
};

//👇🏻 Appwrite authenticate user
export const checkAuthStatus = async (setUser, setLoading, router) => {
    try {
        const request = await account.get();
        setUser(request);
        setLoading(false);
    } catch (err) {
        router.push("/");
    }
};

export const checkAuthStatusDashboard = async (setUser, setLoading, setEvents, router) => {
    try {
        const request = await account.get(); // Check if user is logged in
        getTickets(request.$id, setEvents, setLoading);
        setUser(request);
        setLoading(false);
        return true; // Return true if authenticated
    } catch (err) {
        setLoading(false);
        return false; // Return false if not authenticated
    }
};

//👇🏻 create a new event
export const createEvent = async (
    userId,
    title,
    date,
    time,
    venue,
    description,
    note,
    flier,
    router
) => {
    // Function to create the document in Appwrite
    const createDocument = async (flier_url = "https://google.com") => {
        try {
            const response = await db.createDocument(
                process.env.NEXT_PUBLIC_DB_ID,
                process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: userId,
                    title,
                    date: date.toISOString().split('T')[0], // Format date
                    time,
                    venue,
                    description,
                    note,
                    slug: createSlug(title),
                    attendees: [],
                    disableRegistration: false,
                    flier_url,
                }
            );
            successMessage("Event created successfully 🎉");
            return response.$id; // Return the event ID for further processing
        } catch (error) {
            errorMessage("Error creating event ❌");
            throw error; // Rethrow error for handling in calling function
        }
    };

    // Handle file upload if `flier` is provided
    let flier_url;
    if (flier) {
        try {
            const response = await storage.createFile(
                process.env.NEXT_PUBLIC_BUCKET_ID,
                ID.unique(),
                flier
            );
            flier_url = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`;
        } catch (error) {
            errorMessage("Failed to upload event flier ❌");
            throw error; // Rethrow error for handling in calling function
        }
    }

    // Create the event document and return the event ID
    return await createDocument(flier_url);
};


//👇🏻 register a participant
export const registerAttendee = async (
    name,
    email,
    phoneNumber,
    documentId,
    setSuccess,
    setLoading
) => {
    try {
        setLoading(true);

        // Retrieve the event document
        const doc = await db.getDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            documentId
        );

        // Generate a unique attendee ID
        const attendeeID = generateID();

        // Check if the email already exists in attendees
        const isRegistered = doc.attendees.some((item) => JSON.parse(item).email === email);

        if (!isRegistered) { 
            // If not registered, add the new attendee
            await db.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID,
                process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
                documentId,
                {
                    attendees: [
                        ...doc.attendees,
                        JSON.stringify({ name, email, phoneNumber, id: attendeeID, isPresent:"false"}),
                    ],
                }
            );

            const flierURL = doc.flier_url !== "https://google.com"
                ? doc.flier_url
                : "No flier for this event";

            // Send the email notification
            sendEmail(
                name,
                email,
                doc.title,
                doc.time,
                doc.date,
                doc.note,
                doc.description,
                attendeeID,
                flierURL,
                setSuccess,
                setLoading
            );
        } else {
            errorMessage("User already registered ❌");
            setLoading(false); // Stop loading if already registered
        }
    } catch (err) {
        //console.error(err); // Log error
        errorMessage("Encountered an error!");
        setLoading(false); // Stop loading on error
    }
};



// Function to create a chat message document
const createChatMessage = async (eventId, passcode, name) => {
    try {
        await db.createDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            ID.unique(),
            {
                event_id: eventId,
                passcode,
                user: name,
                messages: [], // Initialize with an empty array for messages
                createdAt: new Date().toISOString(),
            }
        );
    } catch (error) {
        console.error("Error creating chat message document:", error);
        errorMessage("Error creating chat message document ❌");
    }
};

//👇🏻 get all events
export const getEvents = async (setEvents, setLoading) => {
    setLoading(true);
    try {
        const response = await db.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            [Query.orderDesc("date")]
        );
        setEvents(response.documents);
    } catch (error) {
        console.error("Error fetching events:", error);
        errorMessage("Failed to fetch events ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 get specific event
export const getEvent = async (id, setEvent, setLoading) => {
    setLoading(true);
    try {
        const response = await db.getDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            id
        );
        setEvent(response);
    } catch (error) {
        console.error("Error fetching event:", error);
        errorMessage("Failed to fetch event ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 get user's tickets
export const getTickets = async (userId, setEvents, setLoading) => {
    setLoading(true);
    try {
        const response = await db.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            [Query.equal("user_id", userId)]
        );
        setEvents(response.documents);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        errorMessage("Failed to fetch tickets ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 search events
export const searchEvents = async (query, setEvents, setLoading) => {
    setLoading(true);
    try {
        const response = await db.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            [Query.search("title", query)]
        );
        setEvents(response.documents);
    } catch (error) {
        console.error("Error searching events:", error);
        errorMessage("Failed to search events ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 filter events
export const filterEvents = async (filters, setEvents, setLoading) => {
    setLoading(true);
    try {
        const queries = filters.map(filter => Query.equal(filter.field, filter.value));
        const response = await db.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            queries
        );
        setEvents(response.documents);
    } catch (error) {
        console.error("Error filtering events:", error);
        errorMessage("Failed to filter events ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 delete event
export const deleteEvent = async (eventId, setEvents, setLoading) => {
    setLoading(true);
    try {
        await db.deleteDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            eventId
        );
        successMessage("Event deleted successfully 🎉");
        getEvents(setEvents, setLoading); // Refresh event list after deletion
    } catch (error) {
        console.error("Error deleting event:", error);
        errorMessage("Failed to delete event ❌");
    } finally {
        setLoading(false);
    }
};

//👇🏻 update event

export const updateEvent = async (eventID, updatedData, router) => {
    try {
        await db.updateDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            eventID,
            updatedData
        );
        successMessage("Event updated successfully!");
        router.push("/dashboard"); // Redirect to the dashboard after update
    } catch (error) {
        errorMessage("Error updating event:", error);
    }
};

// 👇🏻 Function to send a message to an existing chat document
const sendMessage = async (eventId, passcode, messageContent) => {
    try {
        // Găsește documentul chat corespunzător pentru evenimentul dat
        const response = await db.listDocuments(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            [Query.equal("event_id", eventId), Query.equal("passcode", passcode)]
        );

        // Verifică dacă există documentul de chat
        if (response.documents.length === 0) {
            throw new Error("Nu a fost găsit chat-ul pentru acest eveniment.");
        }

        const chatDocument = response.documents[0];
        const chatId = chatDocument.$id;

        // Adaugă mesajul nou în array-ul de mesaje existent
        const newMessage = {
            content: messageContent,
            timestamp: new Date().toISOString(),
        };

        // Actualizează documentul de chat cu noul mesaj
        await db.updateDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            chatId,
            { messages: [...chatDocument.messages, newMessage] }
        );

        successMessage("Mesaj trimis cu succes 🎉");
    } catch (error) {
        console.error("Eroare la trimiterea mesajului:", error);
        errorMessage("Eroare la trimiterea mesajului în chat ❌");
    }
};

export const sendtoGforms = async (documentId) => {
    try {
        // Retrieve the document from the database
        const document = await db.getDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
            documentId
        );
        // Check if the document exists and has an attendees array
        if (document && document.attendees) {
            // Prepare the attendees array for sending
            const attendees = document.attendees;
            // Send the attendees array as JSON to the specified URL
            const response = await fetch('https://hook.eu2.make.com/zg2fsbrviuqb7f6ae0ld6gmbekg7ixh4', {
                method: 'POST', // Use POST method
                headers: {
                    'Content-Type': 'application/json' // Specify JSON content type
                },
                body:JSON.stringify({"eventTitle":document.title, attendees}) // Send attendees as JSON
            });
            // Handle the response if necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            //console.log('Response from server:', responseData); // Optional logging
        } else {
            throw new Error('Document does not exist or has no attendees.');
        }
    } catch (error) {
        errorMessage("Encountered an error sending to the GForms: " + error.message);
    }
};

//👇🏻 disable an event registration
export const disableRegistration = async (documentId) => {
	try {
		await db.updateDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
			documentId,
			{
				disableRegistration: true,
			}
		);
        sendtoGforms(documentId);
		successMessage("New registration disabled! 🎉");
	} catch (err) {
		console.error(err); // Failure
		errorMessage("Encountered an error 😪");
	}
};