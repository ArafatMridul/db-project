import React from "react";
import { useUser } from "../../context/userContex";
import Navbar from "../../components/Navbar";
import MenuManagement from "./MenuManagement";
import OrderManagement from "./OrderManagement";
import { Navigate } from "react-router-dom";

const Admin = () => {
    const { currentUser } = useUser();

    // if (!currentUser || currentUser.role !== "admin") {
    //     return <Navigate to="/login" replace />;
    // }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-row flex-1">
                <MenuManagement />
                <OrderManagement />
            </div>
        </div>
    );
};

export default Admin;
