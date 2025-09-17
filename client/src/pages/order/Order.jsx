import React, { useState } from "react";
import OrderForm from "./OrderForm";
import CartSummary from "./CartSummary";
import SuccessMessage from "./SuccessMessage";
import Navbar from "../../components/Navbar";

const Order = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Handle successful order creation
    const handleOrderSuccess = (message = "Order placed successfully!") => {
        setSuccessMessage(message);
        setShowSuccess(true);
    };

    // Handle closing success message
    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setSuccessMessage("");
    };

    return (
        <>
            <Navbar />
            <div className="bg-bl h-screen">
                <div className="container grid grid-cols-2 gap-4 pt-20">
                    <div>
                        <OrderForm onOrderSuccess={handleOrderSuccess} />
                    </div>
                    <div>
                        <CartSummary />
                    </div>
                </div>

                {/* Success Message */}
                <SuccessMessage
                    show={showSuccess}
                    message={successMessage}
                    onClose={handleCloseSuccess}
                />
            </div>
        </>
    );
};

export default Order;
