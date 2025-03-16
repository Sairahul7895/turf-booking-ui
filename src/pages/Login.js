import React, { useState, useContext } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { Form, Button, Card, Alert, Container, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      console.log('response : ', response);
      navigate('/');
      authLogin(response);
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center text-primary fw-bold">Login</h2>
          <p className="text-center text-muted">Access your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-primary text-white"><FaUser /></InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Login Button */}
            <Button type="submit" variant="primary" className="w-100 fw-bold shadow-sm">
              Login
            </Button>

            {/* Signup Link */}
            <p className="text-center mt-3">
              Don't have an account? <a href="/signup" className="text-primary fw-bold">Sign up</a>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;