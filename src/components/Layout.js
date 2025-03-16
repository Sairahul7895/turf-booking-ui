import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="layout">
            <Navbar />
            <main className="container mt-5 pt-5 content">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;