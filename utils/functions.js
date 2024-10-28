import { useState } from "react";  // Import useState
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
export const signUp = async (name, email, password, router) => {
	try {
		await account.create(ID.unique(), email, password, name);
		successMessage("Account created! 🎉");
		router.push("/login");
	} catch (err) {
		errorMessage("Check your network / User already exists ❌");
		router.push("/login");
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
		console.error(err);
		errorMessage(err.message || "Invalid credentials ❌");
	}
};

//👇🏻 Appwrite logout function
export const logOut = async (router) => {
	try {
		await account.deleteSession("current");
		router.push("/");
		successMessage("See ya later 🎉");
	} catch (err) {
		console.error(err);
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


//👇🏻 create a new ticket
export const createEvent = async (
	id,
	title,
	date,
	time,
	venue,
	description,
	note,
	flier,
	router
) => {
	const createDocument = async (flier_url = "https://google.com") => {
		try {
			const response = await db.createDocument(
				process.env.NEXT_PUBLIC_DB_ID,
				process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
				ID.unique(),
				{
					user_id: id,
					title,
					date,
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
			successMessage("Ticket created 🎉");
			router.push("/dashboard");
		} catch (error) {
			console.error("DB ERROR >>", error);
			errorMessage("Encountered an error ❌");
		}
	};

	if (flier !== null) {
		try {
			const response = await storage.createFile(
				process.env.NEXT_PUBLIC_BUCKET_ID,
				ID.unique(),
				flier
			);
			const flier_url = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`;
			await createDocument(flier_url);
		} catch (error) {
			console.error("STORAGE ERR >>>", error);
			errorMessage("Encountered an error saving the flier❌");
		}
	} else {
		await createDocument();
	}
};

//👇🏻 get user's tickets
const getTickets = async (id, setEvents, setLoading) => {
	try {
		const request = await db.listDocuments(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
			[Query.equal("user_id", id)]
		);
		setEvents(request.documents);
		setLoading(false);
	} catch (err) {
		console.error(err);
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
		console.error(err); // Failure
		errorMessage("Action declined ❌");
	}
};
export const registerAttendee = async (
    name,
    email,
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
                        JSON.stringify({ name, email, id: attendeeID }),
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
        console.error(err); // Log error
        errorMessage("Encountered an error!");
        setLoading(false); // Stop loading on error
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
		successMessage("New registration disabled! 🎉");
	} catch (err) {
		console.error(err); // Failure
		errorMessage("Encountered an error 😪");
	}
};
