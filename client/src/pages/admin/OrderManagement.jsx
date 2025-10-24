import React, { useEffect, useState } from "react";

const apiBase = "/api/orders";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, []);

    async function fetchOrders() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(apiBase);
            if (!res.ok) throw new Error("Failed to load orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err.message || "Error");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(orderId, newStatus) {
        try {
            const res = await fetch(`${apiBase}/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Update failed");
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId || o._id === orderId
                        ? { ...o, status: newStatus }
                        : o
                )
            );
        } catch (err) {
            alert(err.message || "Failed to update status");
        }
    }

    return (
        <div className="w-1/2 p-4">
            <h2 className="text-xl font-semibold mb-3">Order Management</h2>

            {loading ? (
                <div>Loading orders...</div>
            ) : error ? (
                <div className="text-red-600">Error: {error}</div>
            ) : orders.length === 0 ? (
                <div>No orders.</div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const id = order.id ?? order._id;
                        return (
                            <div key={id} className="p-3 border rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">
                                            Order #{id}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Customer:{" "}
                                            {order.customerName ??
                                                order.customer}
                                        </div>
                                        <div className="text-sm">
                                            Total: $
                                            {Number(order.total ?? 0).toFixed(
                                                2
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            Status:{" "}
                                            <strong>{order.status}</strong>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {order.status !== "preparing" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        id,
                                                        "preparing"
                                                    )
                                                }
                                                className="px-2 py-1 bg-yellow-300 rounded"
                                            >
                                                Set Preparing
                                            </button>
                                        )}
                                        {order.status !== "completed" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        id,
                                                        "completed"
                                                    )
                                                }
                                                className="px-2 py-1 bg-green-600 text-white rounded"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                        {order.status !== "cancelled" && (
                                            <button
                                                onClick={() => {
                                                    if (
                                                        !confirm(
                                                            "Cancel this order?"
                                                        )
                                                    )
                                                        return;
                                                    updateStatus(
                                                        id,
                                                        "cancelled"
                                                    );
                                                }}
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {Array.isArray(order.items) &&
                                    order.items.length > 0 && (
                                        <ul className="mt-2 text-sm space-y-1">
                                            {order.items.map((it, idx) => (
                                                <li key={idx}>
                                                    {it.name} x{it.quantity} — $
                                                    {Number(
                                                        it.price ?? 0
                                                    ).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
