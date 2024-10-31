import React, { useEffect, useState } from "react";
import { db } from "../utils/appwrite.js"; // Ajustează importul conform structurii tale
import Link from "next/link";
import { useRouter } from "next/router"; // Importă useRouter
import Nav from "../components/Nav";

const EventsPage = () => {
  const router = useRouter(); // Inițializează useRouter
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date"); // Sortează după dată sau titlu
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Ajustează după cum este necesar

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
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

  // Sortează evenimentele pe baza intrării utilizatorului
  const sortedEvents = [...events].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Filtrare evenimente în funcție de termenul de căutare
  const filteredEvents = sortedEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logica de paginare
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  
  const getEventStatus = (eventDate, disableRegistration) => {
		const today = new Date();
		const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const eventDateObj = new Date(eventDate);


		if(!disableRegistration) {
			if (eventDateObj <= todayWithoutTime) {
				return "ONGOING"; 
			} else {
				return "UPCOMING"; 
			}
		} else {
			return "FINISHED"; // GATA
		}
	};

  return (
    <div className="container mx-auto p-4">
      <Nav />
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Upcoming Events</h1>
        <div className="mb-4">
          <div className="mb-4">
          <input
            type="text"
            placeholder="Search events..."
            className="border border-blue-700 rounded p-2 bg-white text-black" // Updated className
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
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents.map((event) => (
          <div key={event.$id} className="border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">
              Date: {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className={`mt-2 font-bold ${
            getEventStatus(event.date, event.disableRegistration) === "ONGOING" ? "text-green-600" :
            getEventStatus(event.date, event.disableRegistration) === "UPCOMING" ? "text-blue-600" : "text-gray-600"
            }`}>
            {getEventStatus(event.date, event.disableRegistration)}
            </p>
            <p className="mt-2">{event.description}</p>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="mt-2 rounded" />}
            <Link href={`/register/${event.$id}/${event.slug}`} className="text-blue-500 hover:underline mt-2 inline-block">
              Reserve Tickets
            </Link>
          </div>
        ))}
      </div>

      {/* Paginare */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border rounded px-4 py-2 mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mt-2.5">{`Page ${currentPage} of ${totalPages}`}</span>
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