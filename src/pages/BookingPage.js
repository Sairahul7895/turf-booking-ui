import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Spinner, Form, Button, Row, Col, Card } from "react-bootstrap";
import api from "../utils/api";
import moment from "moment";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getUserDetails } from "../utils/localStorage";

const BookTurf = () => {
    const { id } = useParams();
    const [turf, setTurf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(60);
    const [price, setPrice] = useState(0);
    const [showConfirmBooking, setShowConfirmBooking] = useState(false);
    const [noSlots, setNoSlots] = useState(false);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurfDetails = async () => {
            try {
                const response = await api.get(`/turfs/${id}`);
                console.log('response : ', response);
                setTurf(response.data);
            } catch (error) {
                console.error("Error fetching turf details:", error);
            }
            setLoading(false);
        };

        if (id) {
            fetchTurfDetails();
        }
    }, [id]);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!date) return; // Ensure date is selected before calling API
            try {
                const response = await api.get(`turfs/bookings/turf/${id}?date=${date}`);
                console.log('Bookings : ', response.data); // Handle booked slots here
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching booked slots:", error);
            }
        };

        fetchBookedSlots();
    }, [date]); // Depend on date & turf ID

    useEffect(() => {
        if (!startTime || !turf) return;

        let selectedMoment = moment(startTime, "hh:mm A");
        let closingMoment = moment(turf.availableTo, "h:mm A");
        let endMoment = selectedMoment.clone().add(duration, "minutes"); // Calculate selected end time
        let maxAvailableDuration = closingMoment.diff(selectedMoment, "minutes");

        // Check if the selected duration exceeds available time slots
        if (duration > maxAvailableDuration) {
            setShowConfirmBooking(false);
            setNoSlots(true);
            return;
        }

        // Check if the selected time collides with any booked slots
        const isColliding = bookings.some(({ START_TIME, END_TIME }) => {
            let bookingStart = moment(START_TIME, "HH:mm:ss");
            let bookingEnd = moment(END_TIME, "HH:mm:ss");

            return (
                // If any part of the selected range overlaps with a booked slot
                (selectedMoment.isBefore(bookingEnd) && endMoment.isAfter(bookingStart))
            );
        });
        if (isColliding) {
            setShowConfirmBooking(false);
            setNoSlots(true);
        } else {
            setNoSlots(false);
            setShowConfirmBooking(true);
            setPrice(calculatePrice(startTime, duration)); // Update price if duration is valid
        }
    }, [startTime, duration, date, turf, bookings]);
    // Recalculate price on change

    // useEffect(() => {

    // }, [startTime, duration]); // Runs when either startTime or duration changes

    const generateTimeSlots = () => {
        if (!turf) return [];
        let slots = [];
        let availableFrom = moment(turf.availableFrom, "h:mm A");
        let closingTime = moment(turf.availableTo, "h:mm A").subtract(30, "minutes"); // Exclude last 30 mins
        let currentTime = moment();
        // Adjust availableFrom if it's past the current time (same day)
        if (moment(date).isSame(moment(), "day") && currentTime.isAfter(availableFrom)) {
            availableFrom = currentTime.clone().add(30 - (currentTime.minute() % 30), "minutes").seconds(0);
        }
        // Generate 30-min slots until closing time
        while (availableFrom.isBefore(closingTime)) {
            let slotStart = availableFrom.clone();
            let slotTime = slotStart.format("HH:mm:ss");
            const isBooked = bookings.some(({ START_TIME, END_TIME }) => {
                let bookingStart = moment(START_TIME, "HH:mm:ss");
                let bookingEnd = moment(END_TIME, "HH:mm:ss");
                return (
                    // Exclude slots inside the booked range
                    slotStart.isBetween(bookingStart, bookingEnd, null, "[)")
                    ||
                    // Exclude only the slot exactly 30 mins before a booking
                    slotStart.clone().add(30, "minutes").isBetween(bookingStart, bookingEnd, null, "[)")
                );
            });
            if (!isBooked) slots.push(slotStart.format("hh:mm A"));
            availableFrom.add(30, "minutes");
        }
        return slots;
    };

    const calculatePrice = (selectedTime, selectedDuration) => {
        if (!turf) return 0;

        const selectedMoment = moment(selectedTime, "hh:mm A");
        const endMoment = selectedMoment.clone().add(selectedDuration, "minutes");
        const morningEnd = moment("5:30 PM", "hh:mm A"); // Transition time

        const isWeekend = ["Saturday", "Sunday"].includes(moment(date).format("dddd"));
        const morningRate = (isWeekend ? turf.MORNING_WEEKEND_PRICE : turf.MORNING_WEEKDAY_PRICE) / 60;
        const eveningRate = (isWeekend ? turf.EVENING_WEEKEND_PRICE : turf.EVENING_WEEKDAY_PRICE) / 60;

        const morningMinutes = Math.max(0, Math.min(morningEnd.diff(selectedMoment, "minutes"), selectedDuration));
        const eveningMinutes = selectedDuration - morningMinutes;

        return (morningMinutes * morningRate) + (eveningMinutes * eveningRate);
    };

    const handleDurationChange = (change) => {
        if (!startTime) {
            alert("Please select a start time to set the duration.");
            return;
        }
        let newDuration = duration + change;
        if (newDuration >= 60) {
            setDuration(newDuration);
            setPrice(calculatePrice(startTime, newDuration));
        }
    };

    const submitBooking = async () => {
        const payload = {
            userId: getUserDetails().id,
            turfId: turf.ID,
            turfOwnerId: turf.USER_ID,
            turfName: turf.NAME,
            bookingDate: date,
            startTime: startTime,
            endTime: moment(startTime, "hh:mm A").add(duration, "minutes").format("hh:mm A"),
            duration: duration,
            price: price
        }
        try {
            setLoading(true);
            const response = await api.post("/turfs/createBooking", payload);
            if (response) {
                console.log('response : ', response);
                alert('Booking created successfully!');
                setLoading(false);
                navigate('/')
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <Container className="my-5 d-flex justify-content-center position-relative">
            {/* Loading Overlay (Spinner on top of form without replacing it) */}
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" variant="light" className="spinner-large" />
                </div>
            )}

            <Card className="p-4 shadow-lg border-0 rounded-lg" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-success fw-bold text-center">Book Your Slot</h3>

                {/* Date Picker */}
                <Form.Group className="mt-3">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
                </Form.Group>

                {/* Time Picker */}
                <Form.Group className="mt-3">
                    <Form.Label>Select Start Time</Form.Label>
                    <Form.Select value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={!generateTimeSlots().length}>
                        {generateTimeSlots().length > 0 ? (
                            <>
                                <option value="">Select a time</option>
                                {generateTimeSlots().map((slot, index) => (
                                    <option key={index} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="" disabled>No slots available</option>
                        )}
                    </Form.Select>
                </Form.Group>

                {/* Duration Selection */}
                <Form.Group className="mt-3">
                    <Form.Label>Duration</Form.Label>
                    <div className="d-flex align-items-center justify-content-between">
                        <Button variant="outline-secondary" className="px-3 py-2" onClick={() => handleDurationChange(-30)} disabled={duration === 60}>
                            <i className="bi bi-dash"></i>
                        </Button>
                        <span className="fs-5 fw-bold">{Math.floor(duration / 60)} hr {duration % 60 > 0 ? `${duration % 60} mins` : ""}</span>
                        <Button variant="outline-secondary" className="px-3 py-2" onClick={() => handleDurationChange(30)}>
                            <i className="bi bi-plus"></i>
                        </Button>
                    </div>
                </Form.Group>

                {/* Price Display */}
                <h4 className="mt-4 text-primary fw-bold text-center">Total Price: ₹{Math.round(price)}</h4>
                {noSlots && <div style={{ textAlign: "center" }}>No Slots available</div>}

                {/* Confirm Booking */}
                <Button variant="success" size="lg" className="mt-4 w-100 shadow-sm" disabled={!showConfirmBooking} onClick={submitBooking}>
                    Confirm Booking
                </Button>
            </Card>
        </Container>

    );
};

export default BookTurf;