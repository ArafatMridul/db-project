import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE } from "../../utils/api";

export default function UserOrders() {
    const { data: usersData, loading: usersLoading } = useFetch(
        `${API_BASE}/users`
    );
    const [selectedUser, setSelectedUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const fetchUserOrders = async (userId) => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`${API_BASE}/orders/${userId}`, {
                credentials: "include",
            });
            const data = await res.json();
            setOrders(data.orders || []);
            setSelectedUser(userId);
        } catch (err) {
            console.error("Error fetching user orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const updateOrderStatus = async (orderId, currentStatus, newStatus) => {
        if (currentStatus === newStatus) return;
        try {
            const res = await fetch(`${API_BASE}/order/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId, status: newStatus }),
            });
            const data = await res.json();
            alert(data.message || "Order status updated!");
            fetchUserOrders(selectedUser); // refresh after update
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update order status.");
        }
    };

    if (usersLoading) return <p className="text-center">Loading users...</p>;

    return (
        <motion.div
            className="p-6 grid md:grid-cols-[300px_1fr] gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* LEFT: User List */}
            <div className="border-2 border-gray-200 shadow-md rounded-xl p-4 sticky top-6 h-fit">
                <h2 className="text-xl font-semibold mb-3 text-white">
                    👥 All Users
                </h2>
                <ul className="divide-y divide-gray-200">
                    {usersData?.map((user) => (
                        <motion.li
                            key={user.id}
                            className={`p-3 cursor-pointer rounded transition ${
                                selectedUser === user.id
                                    ? "border border-white font-medium bg-[#404040]"
                                    : "border-none hover:bg-slate-600"
                            }`}
                            onClick={() => fetchUserOrders(user.id)}
                        >
                            <p className="text-white">{user.username}</p>
                            <p className="text-sm text-white">{user.email}</p>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* RIGHT: Orders */}
            <div className="border border-gray-200 shadow-md rounded-xl p-4">
                {!selectedUser ? (
                    <p className="text-white text-center mt-20">
                        👈 Select a user to view their orders
                    </p>
                ) : orders.length > 0 ? (
                    <div>
                        <h2 className="text-2xl mb-4 font-semibold text-white">
                            Orders for User ID: {selectedUser}
                        </h2>
                        {orders.map((order) => {
                            let nextStatuses = [];
                            if (order.status === "pending")
                                nextStatuses = ["cancelled", "confirmed"];
                            if (order.status === "confirmed")
                                nextStatuses = ["cancelled", "delivered"];

                            return (
                                <motion.div
                                    key={order.order_id}
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition bg-[#404040]">
                                        <div className="flex justify-between items-center mb-2 text-white">
                                            <p>
                                                <b>Status:</b>{" "}
                                                <span
                                                    className={`px-2 py-1 rounded text-black ${
                                                        order.status ===
                                                        "pending"
                                                            ? "bg-yellow-500"
                                                            : order.status ===
                                                              "confirmed"
                                                            ? "bg-blue-500"
                                                            : order.status ===
                                                              "delivered"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </p>
                                            <p className="text-sm text-white">
                                                {new Date(
                                                    order.order_date
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <p className="text-white">
                                            <b>Total:</b> ${order.total_amount}
                                        </p>
                                        <ul className="mt-2 mb-3 text-white">
                                            {order.pizzas.map((p, idx) => (
                                                <li key={idx}>
                                                    🍕 {p.pizza_name} ×{" "}
                                                    {p.quantity}
                                                </li>
                                            ))}
                                        </ul>

                                        {nextStatuses.length > 0 && (
                                            <div className="flex gap-3 items-center mt-3">
                                                <select
                                                    className="border border-gray-300 rounded-md py-2 px-4 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                                    onChange={(e) =>
                                                        updateOrderStatus(
                                                            order.order_id,
                                                            order.status,
                                                            e.target.value
                                                        )
                                                    }
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                        hidden
                                                        className="text-black"
                                                    >
                                                        Change status
                                                    </option>
                                                    {nextStatuses.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                                className="text-black"
                                                            >
                                                                {status}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : loadingOrders ? (
                    <p className="text-center text-white mt-20">
                        Loading orders...
                    </p>
                ) : (
                    <p className="text-white text-center mt-20">
                        This user has no orders yet.
                    </p>
                )}
            </div>
        </motion.div>
    );
}
