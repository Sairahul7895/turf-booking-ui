import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/authContext';
import api from "../utils/api";


const AddTurf = () => {
    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        description: '',
        morningWeekdayPrice: '',
        morningWeekendPrice: '',
        eveningWeekdayPrice: '',
        eveningWeekendPrice: '',
        availableFrom: '',
        availableTo: '',
        images: []
    });
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState([20.5937, 78.9629]); // Default: India center
    const [addTurfSpinner, setAddTurfSpinner] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setLocation([position.coords.latitude, position.coords.longitude]),
            () => console.log('Geolocation permission denied')
        );
    }, []);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setFormData({ ...formData, images: e.target.files });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddTurfSpinner(true);
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'images') {
                for (let file of value) {
                    formDataToSend.append('images', file);
                }
            } else {
                formDataToSend.append(key, value);
            }
        });

        try {
            await api.post('turfs/add', formDataToSend);
            setAddTurfSpinner(false);
            alert('Turf added successfully!');
        } catch (error) {
            setAddTurfSpinner(false); // Hide spinner
            console.log('error',error);
        }
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setFormData((prev) => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng }));
                setLocation([e.latlng.lat, e.latlng.lng]);
            }
        });
        return location ? <Marker position={location} icon={customIcon} /> : null;
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">Add Turf</h2>
            <Form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
                <Form.Group className="mb-3">
                    <Form.Label>Turf Name</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} required />
                </Form.Group>

                <Row>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control type="text" value={formData.latitude} readOnly />
                    </Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control type="text" value={formData.longitude} readOnly />
                    </Form.Group></Col>
                </Row>
                <Button variant="primary" onClick={() => setShowMap(true)}>Select Location</Button>

                <Form.Group className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" onChange={handleChange} required />
                </Form.Group>

                <h5 className="mt-3">Pricing</h5>
                <Row>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Morning Weekdays Price</Form.Label>
                        <Form.Control type="number" name="morningWeekdayPrice" onChange={handleChange} required />
                    </Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Morning Weekends Price</Form.Label>
                        <Form.Control type="number" name="morningWeekendPrice" onChange={handleChange} required />
                    </Form.Group></Col>
                </Row>
                <Row>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Evening Weekdays Price</Form.Label>
                        <Form.Control type="number" name="eveningWeekdayPrice" onChange={handleChange} required />
                    </Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Evening Weekends Price</Form.Label>
                        <Form.Control type="number" name="eveningWeekendPrice" onChange={handleChange} required />
                    </Form.Group></Col>
                </Row>

                <h5 className="mt-3">Available Timings</h5>
                <Row>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Available From</Form.Label>
                        <Form.Control type="time" name="availableFrom" onChange={handleChange} required />
                    </Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3">
                        <Form.Label>Available To</Form.Label>
                        <Form.Control type="time" name="availableTo" onChange={handleChange} required />
                    </Form.Group></Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Upload Images</Form.Label>
                    <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} required />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">Add Turf</Button>
            </Form>

            <Modal show={showMap} onHide={() => setShowMap(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Select Location</Modal.Title></Modal.Header>
                <Modal.Body>
                    <MapContainer center={location} zoom={13} style={{ height: '400px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMap(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            {addTurfSpinner && (
                <div className="overlay-spinner">
                    <Spinner animation="border" variant="light" style={{ width: '4rem', height: '4rem' }} />
                    <p>Adding Turf...</p>
                </div>
            )}
        </Container>
    );
};

export default AddTurf;
