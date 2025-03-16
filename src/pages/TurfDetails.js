import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Image, Row, Col, Card, Button } from "react-bootstrap";
import api from "../utils/api"; // Your API instance
import { useNavigate } from "react-router-dom";

const TurfDetails = () => {
    const { id } = useParams(); // Get Turf ID from URL
    const [turf, setTurf] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurfDetails = async () => {
            try {
                const response = await api.get(`/turfs/${id}`);
                console.log('response:', response);
                setTurf(response.data); // Store fetched data
            } catch (error) {
                console.error("Error fetching turf details:", error);
            }
            setLoading(false);
        };

        if (id) {
            fetchTurfDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="loading-overlay">
        <Spinner animation="border" variant="light" className="spinner-large" />
        <p className="loading-text">Getting Turf details...</p>
    </div>
        );
    }

    if (!turf) {
        return <p className="text-center text-muted">Turf not found.</p>;
    }

    const handleBooking = (turfId) => {
        navigate(`/bookTurf/${turfId}`)
    }

    return (
        <Container className="my-5">
            <Row className="align-items-start">
                {/* Left Side - Turf Name + Image */}
                <h1 className="mb-3">{turf.NAME}</h1>

                <Col md={7}>
                    {/* Turf Name */}

                    {/* Image Gallery (Carousel) */}
                    <div id={`imageCarousel-${turf.ID}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                        style={{ width: "100%", maxWidth: "800px", height: "60vh", maxHeight: "500px", margin: "auto" }}>

                        <div className="carousel-inner rounded shadow-lg" style={{ width: "100%", height: "100%" }}>
                            {turf.PHOTOS.map((photo, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}
                                    style={{ width: "100%", height: "100%" }}>

                                    <img src={photo} className="d-block w-100 h-100 rounded" alt="Turf"
                                        style={{ objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <button className="carousel-control-prev" type="button" data-bs-target={`#imageCarousel-${turf.ID}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#imageCarousel-${turf.ID}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>


                </Col>

                {/* Right Side - Turf Details in Cards */}
                <Col md={5}>
                    <Card className="mb-3 shadow-sm p-3">
                        <Card.Body>
                            <Card.Title>📍 Location</Card.Title>
                            <Card.Text>{turf.locationName}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-sm p-3">
                        <Card.Body>
                            <Card.Title>🕒 Available Timings</Card.Title>
                            <Card.Text>{turf.availableFrom} - {turf.availableTo}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm p-3">
                        <Card.Body className="text-center">
                            <Button variant="success" size="lg" onClick={() => handleBooking(turf.ID)}>Book Now</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TurfDetails;