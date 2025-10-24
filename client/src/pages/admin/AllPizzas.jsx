import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE, headers } from "../../utils/api";

export default function AllPizzas() {
    const { data, loading } = useFetch(`${API_BASE}/all-pizzas`);
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Normalize data from backend
    const pizzas = Array.isArray(data) ? data : data?.pizzas || [];

    if (loading) return <p className="text-center">Loading pizzas...</p>;

    // Handle edit click
    const handleEdit = (pizza) => {
        setSelectedPizza(pizza);
        setForm({
            pizza_id: pizza.pizza_id,
            name: pizza.name,
            unit_price: pizza.unit_price,
            img_url: pizza.img_url,
            ingredients: pizza.ingredients || [],
        });
        setIsEditing(true);
    };

    // Handle update pizza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${API_BASE}/edit-pizza`, {
                method: "PUT",
                headers,
                body: JSON.stringify(form),
            });
            const data = await res.json();
            alert(data.message || "Pizza updated successfully!");
            window.location.reload();

            setSelectedPizza(null);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating pizza:", err);
            alert("Failed to update pizza");
        } finally {
            setSaving(false);
        }
    };

    // 🔄 Handle Sold-Out Toggle
    const handleSoldOutToggle = async (pizza) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`${API_BASE}/mark-soldout`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    pizza_id: pizza.pizza_id,
                    soldOut_status: !pizza.soldOut_status,
                }),
            });

            const data = await res.json();
            alert(data.message);

            // Update local UI instantly
            pizza.soldOut_status = !pizza.soldOut_status;
            setSelectedPizza({ ...pizza });
        } catch (err) {
            console.error("Error toggling sold out status:", err);
            alert("Failed to change status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <motion.div
            className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {pizzas.map((p) => (
                <motion.div
                    key={p.pizza_id}
                    className="p-4 border-2 border-gray-200 shadow rounded-lg cursor-pointer hover:shadow-lg transition text-white"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPizza(p)}
                >
                    <div className="relative">
                        <img
                            src={p.img_url}
                            alt={p.name}
                            className="h-40 w-full object-cover rounded-md border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-bg-black/20 to-black-10"/>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold">{p.name}</h3>
                    <p>${p.unit_price}</p>
                    <p
                        className={`mt-1 text-sm font-semibold ${
                            p.soldOut_status ? "text-red-500" : "text-green-600"
                        }`}
                    >
                        {p.soldOut_status ? "❌ Sold Out" : "✅ Available"}
                    </p>
                </motion.div>
            ))}

            {/* MODAL */}
            <AnimatePresence>
                {selectedPizza && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl w-[420px] relative overflow-hidden pt-10"
                            initial={{ scale: 0.85, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 hover:bg-gray-100 rounded-lg"
                                onClick={() => {
                                    setSelectedPizza(null);
                                    setIsEditing(false);
                                }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="black"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* VIEW MODE */}
                            {!isEditing ? (
                                <div className="p-6">
                                    <div className="mb-5">
                                        <img
                                            src={selectedPizza.img_url}
                                            alt={selectedPizza.name}
                                            className="h-48 w-full object-cover rounded-xl shadow-md"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedPizza.name}
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Price
                                            </span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                ${selectedPizza.unit_price}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">
                                                Status
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    selectedPizza.soldOut_status
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {selectedPizza.soldOut_status
                                                    ? "Sold Out"
                                                    : "Available"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                handleSoldOutToggle(
                                                    selectedPizza
                                                )
                                            }
                                            disabled={updatingStatus}
                                            className={`flex-1 ${
                                                selectedPizza.soldOut_status
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-red-600 hover:bg-red-700"
                                            } text-white font-semibold py-3 rounded-lg shadow-md transition-all ${
                                                updatingStatus
                                                    ? "opacity-60 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {updatingStatus
                                                ? "Updating..."
                                                : selectedPizza.soldOut_status
                                                ? "Mark Available"
                                                : "Mark Sold Out"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleEdit(selectedPizza)
                                            }
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* EDIT MODE */
                                <form
                                    className="p-6 flex flex-col gap-4"
                                    onSubmit={handleSubmit}
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        ✏️ Edit Pizza
                                    </h2>

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Pizza name"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={form.unit_price}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    unit_price: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={form.img_url}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    img_url: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Ingredients */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Ingredients
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Cheese, tomato, basil..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={
                                                form.ingredients?.join(", ") ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    ingredients: e.target.value
                                                        .split(",")
                                                        .map((i) => i.trim()),
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className={`flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg transition-all ${
                                                saving
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-green-700"
                                            }`}
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
