import React from "react";
import dynamic from "next/dynamic";
import Nav from "../components/Nav";
import { db } from "../utils/appwrite";
import { toast } from "react-toastify";
import { Query } from "appwrite";

// Dynamically import QrReader with SSR disabled
const QrReader = dynamic(() => import("react-qr-scanner"), { ssr: false });

class QRScan extends React.Component {
  state = {
    delay: 1000, // 1 second delay
    result: "No result",
    passcode: "",
    title: "",
    lastScanned: "", // Track last scanned QR code content
    hasConfirmed: false, // Track if attendance has already been confirmed
  };

  handleScan = (data) => {
    if (data) {
      const result = data.text || "No result";

      // Only proceed if scanned content has changed
      if (result !== this.state.lastScanned) {
        this.setState({ result, lastScanned: result }, () => this.splitResult(result));
      }
    }
  };

  handleError = (err) => {
    console.error(err);
    this.setState({ result: "Error scanning QR code." });
  };

  // Split the result into passcode and title if valid, otherwise show error
  splitResult = (result) => {
    const parts = result.split("-");
    if (parts.length === 2) {
      const [passcode, title] = parts;
      this.setState({ passcode, title, hasConfirmed: false }, this.checkAttendeePresence);
    } else {
      toast.error("Not a valid attendance link!");
      this.setState({ result: "Not a valid attendance link!", hasConfirmed: false });
    }
  };

  // Check and update attendee presence in Appwrite
  checkAttendeePresence = async () => {
    const { passcode, title, hasConfirmed } = this.state;

    // Avoid re-confirmation if already processed
    if (hasConfirmed) return;

    try {
      // Search for the event by title
      const searchResult = await db.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
        [Query.equal("title", title)]
      );

      if (searchResult.total === 0) {
        toast.error("Event not found!");
        return;
      }

      // Assume first matching document as the event
      const eventDocument = searchResult.documents[0];
      const attendees = eventDocument.attendees.map(JSON.parse);

      // Find the attendee by passcode
      const attendeeIndex = attendees.findIndex((attendee) => attendee.id === passcode);

      if (attendeeIndex === -1) {
        toast.error("Attendee not found!");
        return;
      }

      // Check if attendee is already marked as present
      if (attendees[attendeeIndex].isPresent === "true") {
        toast.info("Attendance already confirmed for this attendee.");
        this.setState({ result: "Attendance already confirmed", hasConfirmed: true });
        return;
      }

      // Update isPresent to "true" for this attendee
      attendees[attendeeIndex].isPresent = "true";

      // Update the event document in Appwrite
      await db.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_EVENTS_COLLECTION_ID,
        eventDocument.$id,
        { attendees: attendees.map((attendee) => JSON.stringify(attendee)) }
      );

      toast.success("Attendance updated successfully!");
      this.setState({ result: "Attendance confirmed", hasConfirmed: true }); // Set confirmation flag
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance");
    }
  };

  render() {
    return (
      <div className='home bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen'>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-teal-50 p-4">
          <h1 className="text-3xl font-semibold text-blue-600 mb-6">Scan QR Code</h1>

          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-blue-300 mb-4 p-4">
            <QrReader
              delay={this.state.delay}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "600px", height: "500px" }}
            />
          </div>

          <div className="w-full max-w-md text-center bg-white border border-blue-200 shadow-md rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Scanned Result</p>
              <p className="text-lg font-semibold text-gray-700">{this.state.result}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QRScan;
