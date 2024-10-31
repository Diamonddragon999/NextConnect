import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTable } from "react-table";
import DisableReg from "./DisableReg";
import { parseJSON } from "../utils/functions";
import { formatPhoneNumber } from "../utils/functions";

const Attendees = ({
	attendees,
	id,
	click,
	setClick,
	disableRegModal,
	setDisableRegModal,
}) => {
	const [passcode, setPasscode] = useState("");
	const attendeesArray = attendees.map(parseJSON);
	const [attendeeState, setAttendees] = useState(attendeesArray);

	// Define columns with custom rendering for isPresent and phoneNumber
	const data = React.useMemo(() => attendeeState, [attendeeState]);
	const columns = React.useMemo(
		() => [
			{
				Header: "Passcode",
				accessor: "id",
			},
			{
				Header: "Name",
				accessor: "name",
			},
			{
				Header: "Email",
				accessor: "email",
			},
			{
				Header: "Phone Number",
				accessor: "phoneNumber",
				Cell: ({ value }) => (
					<div className="flex justify-center items-center">
						{
						formatPhoneNumber(value)
						}
					</div>
				),
			},
			{
				Header: "Is Present?",
				accessor: "isPresent",
				Cell: ({ value }) => (
					<div className="flex justify-center items-center">
						{value === "true" ? (
							<FaCheckCircle className="text-green-500 text-xl" />
						) : (
							<FaTimesCircle className="text-red-500 text-xl" />
						)}
					</div>
				),
			},
		],
		[]
	);

	const table = useTable({ columns, data });
	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = table;

	const handleSearch = () => {
		const result = attendeeState.filter((item) => item.id.startsWith(passcode));
		setAttendees(passcode === "" ? attendeesArray : result);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSearch();
	};

	return (
		<div className="bg-white w-full p-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-6">
				<h2 className="text-3xl font-bold md:mb-auto mb-4">
					List of Attendees
				</h2>
				{!click && (
					<button
						className={`p-4 ${click && "hidden"} text-white rounded-md bg-blue-600`}
						onClick={() => setDisableRegModal(true)}
					>
						End Event
					</button>
				)}
			</div>
			{disableRegModal && (
				<DisableReg setDisableRegModal={setDisableRegModal} setClick={setClick} id={id} />
			)}

			<form className="w-full flex items-center justify-center mb-6" onSubmit={handleSubmit}>
				<input
					type="text"
					className="border-[1px] w-[80%] rounded-lg py-2 px-4 mr-3"
					placeholder="Search via Passcode"
					value={passcode}
					onChange={(e) => setPasscode(e.target.value)}
				/>
				<button className="border-[1px] p-3 rounded-full">
					<BsSearch className="text-2xl" />
				</button>
			</form>
			<div className="overflow-y-scroll max-h-[450px]">
				<table className="relative w-full" {...getTableProps()}>
					<thead className="sticky top-0 bg-white z-10">
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th {...column.getHeaderProps()} className="p-2 text-center border-b">
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map((row) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()} className="hover:bg-gray-100">
									{row.cells.map((cell) => (
										<td {...cell.getCellProps()} className="p-2 border-b text-center">
											{cell.render("Cell")}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Attendees;