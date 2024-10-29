import React, { useEffect, useState } from "react";
import { db } from "../utils/appwrite.js"; // Adjust the import according to your structure
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter

const EventsPage = () => {
  const router = useRouter(); // Initialize useRouter
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date"); // Sort by date or title
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch all events (you may want to filter this based on date)
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID
        );
        setEvents(response.documents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  // Sort events based on user input
  const sortedEvents = [...events].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Upcoming Events</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          className="border rounded p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded p-2 ml-2"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents.map((event) => (
          <div key={event.$id} className="border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">
              Date: {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className="mt-2">{event.description}</p>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="mt-2 rounded" />}
            {/* Update the Link to use documentid */}
            <Link href={`/register/${event.documentId}/${event.slug}`} className="text-blue-500 hover:underline mt-2 inline-block">
              Reserve Tickets
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border rounded px-4 py-2 mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="border rounded px-4 py-2 ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
