import React, { useEffect } from "react";
import OrderList from "../../pages/order/OrderList";
import OrderStats from "../../pages/order/OrderStats";
import { useUser } from "../../context/userContex";
import { useOrder } from "../../context/orderContext";
import Navbar from "../../components/Navbar";

const OrdersPage = () => {
    const { orders, orderStats, isLoading, fetchUserOrders } = useOrder();
    const { currentUser } = useUser();

    // Fetch orders when component mounts or user changes
    useEffect(() => {
        if (currentUser) {
            fetchUserOrders();
        }
    }, [currentUser, fetchUserOrders]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Please Log In
                        </h2>
                        <p className="text-gray-500">
                            You need to log in to view your orders
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-bl h-screen pt-8">
                <div className="bg-bl">
                    <div className="container">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                My Orders
                            </h1>
                            <p className="text-slate-200">
                                Track and manage your pizza orders
                            </p>
                        </div>

                        {/* Order Statistics */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Order Summary
                            </h2>
                            <OrderStats orderStats={orderStats} />
                        </div>

                        {/* Order List */}
                        <div>
                            <OrderList orders={orders} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrdersPage;
