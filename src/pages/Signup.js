import React, { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Form, Button, Card, Alert, Container, InputGroup } from 'react-bootstrap';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({ name, email, password });
      if (response.message) {
        console.log('Signup successful');
        navigate('/login'); // Redirect after successful signup
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center text-primary fw-bold">Sign Up</h2>
          <p className="text-center text-muted">Create a new account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Name Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-primary text-white"><FaUser /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-primary text-white"><FaEnvelope /></InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-primary text-white"><FaLock /></InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Signup Button */}
            <Button type="submit" variant="primary" className="w-100 fw-bold shadow-sm">
              Sign Up
            </Button>

            {/* Login Link */}
            <p className="text-center mt-3">
              Already have an account? <a href="/login" className="text-primary fw-bold">Login</a>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;