import React, { useState } from "react";
import { useCart } from "../../context/cartContex";
import { useUser } from "../../context/userContex";
import { useOrder } from "../../context/orderContext";
import { Link } from "react-router-dom";

const OrderForm = ({ onOrderSuccess }) => {
    const { cartItems, clearCart } = useCart();
    const { currentUser } = useUser();
    const { createOrder, isCreatingOrder } = useOrder();

    const [orderSuccess, setOrderSucces] = useState(false);
    const [orderForm, setOrderForm] = useState({
        address: "",
        phone_number: "",
    });
    const [formErrors, setFormErrors] = useState({});

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!orderForm.address.trim()) {
            errors.address = "Address is required";
        } else if (orderForm.address.trim().length < 10) {
            errors.address = "Please enter a complete address";
        }

        if (!orderForm.phone_number.trim()) {
            errors.phone_number = "Phone number is required";
        } else if (!/^[+]?[\d\s\-\\(\\)]{10,}$/.test(orderForm.phone_number)) {
            errors.phone_number = "Please enter a valid phone number";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Handle order submission
    const handleSubmitOrder = async () => {
        if (!validateForm()) {
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!currentUser) {
            alert("Please log in to place an order!");
            return;
        }

        const result = await createOrder(orderForm);

        if (result.success) {
            // Clear form
            setOrderForm({ address: "", phone_number: "" });
            setFormErrors({});

            // Clear cart (if you have this function in cart context)
            if (clearCart) {
                clearCart();
            }

            // Show success message
            if (onOrderSuccess) {
                const orderData = result.data;
                const message = `Order #${orderData.orderId} placed successfully! Total: ${orderData.totalAmount}`;
                onOrderSuccess(message);
                setOrderSucces(true);
            }
        } else {
            // Handle error properly - convert object to string if needed
            const errorMessage =
                typeof result.error === "string"
                    ? result.error
                    : result.error?.message ||
                      JSON.stringify(result.error) ||
                      "Failed to create order";
            alert(errorMessage);
        }
    };

    return (
        <div className="bg-bl rounded-lg px-8 py-12 border-2 border-white">
            <h2 className="text-xl font-semibold mb-4 text-white">
                Delivery Information
            </h2>

            <div className="space-y-4">
                {/* Auto-filled fields (read-only) */}
                <div>
                    <label className="block text-sm font-extrabold text-slate-200 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        value={currentUser?.username || ""}
                        disabled
                        className="w-full px-3 py-2 border border-white rounded-md bg-bl text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-extrabold text-slate-200 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={currentUser?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-white rounded-md bg-bl text-white"
                    />
                </div>

                {/* User input fields */}
                <div>
                    <label className="block text-sm font-extrabold text-slate-200 mb-1">
                        Delivery Address *
                    </label>
                    <textarea
                        name="address"
                        value={orderForm.address}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter your complete delivery address..."
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder:text-white ${
                            formErrors.address
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {formErrors.address}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-extrabold text-slate-200 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={orderForm.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number..."
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder:text-white ${
                            formErrors.phone_number
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {formErrors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">
                            {formErrors.phone_number}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Link
                        to="/menu"
                        className="w-full bg-transparent text-white border-2 border-white font-extrabold py-2 px-4 rounded-md hover:bg-slate-200 hover:text-bl focus:ring-bl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out cursor-pointer text-center"
                    >
                        Change Cart
                    </Link>
                    <button
                        onClick={handleSubmitOrder}
                        disabled={
                            isCreatingOrder ||
                            cartItems.length === 0 ||
                            !currentUser
                        }
                        className="w-full bg-yellow-400 text-bl font-extrabold py-2 px-4 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-bl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out cursor-pointer"
                    >
                        {isCreatingOrder ? "Creating Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
