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
    const [showToday, setShowToday] = useState(false);

    // 🔹 Fetch orders for one user
    const fetchUserOrders = async (userId) => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`${API_BASE}/orders/${userId}`, {
                credentials: "include",
            });
            const data = await res.json();
            setOrders(data.orders || []);
            setSelectedUser(userId);
            setShowToday(false);
        } catch (err) {
            console.error("Error fetching user orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    // 🔹 Combine orders of all users and filter for today
    const fetchTodaysOrders = async () => {
        if (!usersData || usersData.length === 0) return;
        setLoadingOrders(true);
        try {
            const allOrders = [];

            for (const user of usersData) {
                const res = await fetch(`${API_BASE}/orders/${user.id}`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.orders?.length) {
                    // attach user info for display
                    const userOrders = data.orders.map((o) => ({
                        ...o,
                        user: { username: user.username, email: user.email },
                    }));
                    allOrders.push(...userOrders);
                }
            }

            // Filter only today's
            const today = new Date();
            const todaysOrders = allOrders.filter((order) => {
                const date = new Date(order.order_date);
                return (
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate()
                );
            });

            setOrders(todaysOrders);
            setShowToday(true);
            setSelectedUser(null);
        } catch (err) {
            console.error("Error fetching today's orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    // 🔹 Update status
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

            // refresh correct data
            if (showToday) fetchTodaysOrders();
            else if (selectedUser) fetchUserOrders(selectedUser);
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
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-white">
                        👥 All Users
                    </h2>
                </div>

                <ul className="divide-y divide-gray-200 grid gap-3">
                    {usersData?.map((user) => (
                        <motion.li
                            key={user.id}
                            className={`p-3 border-none cursor-pointer rounded transition ${
                                selectedUser === user.id
                                    ? "ring-2 ring-gray-200 font-medium bg-[#404040]"
                                    : "hover:ring-1 hover:ring-gray-200 hover:bg-[#404040]"
                            }`}
                            onClick={() => fetchUserOrders(user.id)}
                        >
                            <p className="text-white">{user.username}</p>
                            <p className="text-sm text-white">{user.email}</p>
                        </motion.li>
                    ))}
                </ul>
                <button
                    onClick={fetchTodaysOrders}
                    className="bg-[#404040] outline-2 cursor-pointer outline-gray-200 text-white text-sm px-3 py-2 rounded-lg shadow mt-4"
                >
                    Show Today’s Orders
                </button>
            </div>

            {/* RIGHT: Orders */}
            <div className="border border-gray-200 shadow-md rounded-xl p-4">
                {loadingOrders ? (
                    <p className="text-center text-white mt-20">
                        Loading orders...
                    </p>
                ) : orders.length > 0 ? (
                    <div>
                        <h2 className="text-2xl mb-4 font-semibold text-white">
                            {showToday
                                ? "📅 All Orders Placed Today"
                                : `Orders for User ID: ${selectedUser}`}
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

                                        {/* User info only for all-today view */}
                                        {showToday && order.user && (
                                            <p className="text-white mb-2">
                                                <b>User:</b>{" "}
                                                {order.user.username} (
                                                {order.user.email})
                                            </p>
                                        )}

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
                                                    >
                                                        Change status
                                                    </option>
                                                    {nextStatuses.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
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
                ) : (
                    <p className="text-white text-center mt-20">
                        {showToday
                            ? "No orders placed today."
                            : selectedUser
                            ? "This user has no orders yet."
                            : "👈 Select a user or show today's orders"}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
