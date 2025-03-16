import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const NearByTurfs = () => {
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchTurfs(latitude, longitude);
                    },
                    async (error) => {
                        console.warn("Geolocation failed, using IP-based location...");
                        await getIPBasedLocation();
                    }
                );
            } else {
                console.warn("Geolocation not supported, using IP-based location...");
                getIPBasedLocation();
            }
        };

        const fetchTurfs = async (lat, lon) => {
            try {
                const response = await api.get(`/turfs/getTurfs?lat=${lat}&lon=${lon}`);
                console.log("Response:", response);
                setTurfs(response.data);
            } catch (error) {
                console.error("Error fetching turfs:", error);
            } finally {
                setLoading(false);
            }
        };

        const getIPBasedLocation = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                console.log("IP-Based Location:", data.latitude, data.longitude);
                fetchTurfs(data.latitude, data.longitude);
            } catch (error) {
                console.error("IP Geolocation failed:", error);
                setLoading(false);
            }
        };

        getUserLocation();
    }, []);

    const handleBookNow = (turfId) => {
        navigate(`/turf/${turfId}`); // Redirect to Turf Details Page
    }


    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" variant="light" className="spinner-large" />
                    <p className="loading-text">Finding Nearby Turfs...</p>
                </div>
            )}

            <Container className="my-5">
                <h2 className="text-center mb-4">🏟️ Nearby Turfs</h2>

                {turfs.length > 0 ? (
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {turfs.map((turf) => (
                            <Col key={turf.ID}>
                                <Card className="shadow-lg border-0 turf-card">
                                    <Card.Body className="text-center">
                                        <Card.Title className="fw-bold">{turf.NAME}</Card.Title>
                                    </Card.Body>
                                    <Card.Img
                                        variant="top"
                                        src={turf.PHOTO_URL}
                                        alt={turf.NAME}
                                        className="img-fluid"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Text className="text-muted">
                                            <strong>📏 Distance:</strong> {turf.distance_km.toFixed(2)} km
                                        </Card.Text>
                                        <Button variant="primary" className="w-100" onClick={() => handleBookNow(turf.ID)}>
                                            🔥 Book Now
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p className="text-center text-muted">No turfs found within 50 km.</p>
                )}
            </Container>
        </>
    );
};

export default NearByTurfs;