import React, { useState } from "react";
import { useOrder } from "../../context/orderContext";
import { motion, AnimatePresence } from "motion/react";

const OrderList = ({ orders }) => {
    const { cancelOrder } = useOrder();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Handle order cancellation
    const handleCancelOrder = async (orderId) => {
        const result = await cancelOrder(orderId);

        if (result.success) {
            alert("Order cancelled successfully");
        } else if (!result.cancelled) {
            alert(result.error || "Failed to cancel order");
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-400 text-bl";
            case "confirmed":
                return "bg-blue-400 text-bl";
            case "preparing":
                return "bg-orange-400 text-bl";
            case "out_for_delivery":
                return "bg-purple-400 text-bl";
            case "delivered":
                return "bg-green-400 text-bl";
            case "cancelled":
                return "bg-red-400 text-bl";
            default:
                return "bg-gray-400 text-bl";
        }
    };

    // Format status text
    const formatStatus = (status) => {
        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Your Orders</h2>
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg
                            className="w-12 h-12 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            ></path>
                        </svg>
                    </div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Your order history will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bl rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-white">Your Orders</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <div key={order.order_id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-semibold text-white">
                                        Order #{order.order_id}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {formatStatus(order.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-200">
                                    {new Date(
                                        order.order_date
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p className="text-lg font-semibold text-yellow-400 mt-1">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() =>
                                        setSelectedOrder(
                                            selectedOrder === order.order_id
                                                ? null
                                                : order.order_id
                                        )
                                    }
                                    className="px-3 py-1 text-sm border text-white border-gray-300 rounded hover:bg-gray-50 hover:text-bl transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                    {selectedOrder === order.order_id
                                        ? "Hide Details"
                                        : "View Details"}
                                </button>
                                {order.status === "pending" && (
                                    <button
                                        onClick={() =>
                                            handleCancelOrder(order.order_id)
                                        }
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300 ease-in-out cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Details */}
                        <AnimatePresence mode="wait">
                            {selectedOrder === order.order_id && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="overflow-clip"
                                >
                                    <div className="mt-4 p-4 bg-neutral-700 border-2 border-white rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-medium text-white mb-2">
                                                    Delivery Information
                                                </h4>
                                                <div className="space-y-1 text-sm text-slate-200">
                                                    <p>
                                                        <span className="font-medium">
                                                            Name:
                                                        </span>{" "}
                                                        {order.name}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Email:
                                                        </span>{" "}
                                                        {order.email}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Phone:
                                                        </span>{" "}
                                                        {order.phone_number}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Address:
                                                        </span>{" "}
                                                        {order.address}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white mb-2">
                                                    Order Items
                                                </h4>
                                                <div className="space-y-2">
                                                    {order.items &&
                                                        order.items.map(
                                                            (item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between text-sm text-slate-200"
                                                                >
                                                                    <span className="flex-1">
                                                                        {
                                                                            item.pizza_name
                                                                        }{" "}
                                                                        ×{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    <span className="font-medium">
                                                                        $
                                                                        {(
                                                                            parseFloat(
                                                                                item.unit_price
                                                                            ) *
                                                                            item.quantity
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    <div className="border-t pt-2 flex justify-between font-semibold text-white">
                                                        <span>Total:</span>
                                                        <span>
                                                            $
                                                            {parseFloat(
                                                                order.total_amount
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList;
