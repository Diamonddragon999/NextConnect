import React from "react";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";
import { deleteTicket, formatDate } from "../utils/functions";

const Events = ({ events }) => {
	const router = useRouter();

	const handleRoute = (slug, id) =>
		router.push({ pathname: `/events/${id}/${slug}` });

	// Helper function to determine event status
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
		<div className='w-full flex flex-wrap items-center justify-center'>
			{events.map((event) => (
				<div
					className='md:w-[450px] w-full hover:shadow border-[1px] rounded-2xl m-3'
					key={event.$id}
				>
					<div
						className='p-4 w-full cursor-pointer'
						onClick={() => handleRoute(event.slug, event.$id)}
					>
						<h2 className='text-xl font-medium mb-6'>{event.title}</h2>
						<p className='opacity-80'>
							{event?.attendees?.length > 0
								? `${event.attendees.length} person(s) registered`
								: `No attendee yet`}
						</p>

						<p className='opacity-50'>Date: {formatDate(event.date)}</p>
						<p className='opacity-50'>Venue: {event.venue}</p>
						
						{/* Event Status */}
						<p className={`mt-2 font-bold ${
							getEventStatus(event.date, event.disableRegistration) === "ONGOING" ? "text-green-600" :
							getEventStatus(event.date, event.disableRegistration) === "UPCOMING" ? "text-blue-600" : "text-gray-600"
						}`}>
							{getEventStatus(event.date, event.disableRegistration)}
						</p>
					</div>

					<div className='w-full py-6 bg-blue-600 rounded-b-2xl flex items-center px-4 justify-between'>
						<MdDelete
							className='text-gray-200 text-2xl cursor-pointer'
							onClick={() => deleteTicket(event.$id)}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default Events;
