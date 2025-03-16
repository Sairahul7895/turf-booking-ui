import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { getUserDetails } from "../utils/localStorage";

const NavigationBar = () => {
  const { authToken, logout } = useContext(AuthContext); // Assuming user data is in context
  useEffect(()=>{
console.log('getUserDetails : ',getUserDetails())
  },[])

  return (
    <Navbar expand="lg" bg="white" variant="light" className="shadow-sm fixed-top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          ⚽ Turf Booking
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            {authToken ? (
              <>
                <Nav.Link as={Link} to="/" className="text-dark fw-semibold">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/addTurf" className="text-dark fw-semibold">
                  Add Turf
                </Nav.Link>
                <Nav.Link as={Link} to="/allTurfs" className="text-dark fw-semibold">
                  Book Turf
                </Nav.Link>

                {/* User Profile Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex align-items-center profile-toggle"
                    style={{ cursor: "pointer" }}
                  >
                    {getUserDetails()?.photo ? (
                      <Image
                        src={getUserDetails().photo}
                        alt="User Avatar"
                        roundedCircle
                        width="35"
                        height="35"
                        className="me-2"
                      />
                    ) : (
                      <FaUserCircle size={35} className="me-2 text-dark" />
                    )}
                    <span className="fw-semibold text-dark">{getUserDetails()?.name || "User"}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item as={Link} to="/profile">👤 Profile</Dropdown.Item>
                    <Dropdown.Item onClick={logout}>🚪 Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-dark fw-semibold">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-dark fw-semibold">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;