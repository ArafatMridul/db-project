import React, { useEffect, useState } from "react";

const apiBase = "/api/menu";

export default function MenuManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        editingId: null,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(apiBase);
            if (!res.ok) throw new Error("Failed to load menu");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError(err.message || "Error");
            // fallback: empty list
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            name: form.name.trim(),
            price: parseFloat(form.price) || 0,
            description: form.description.trim(),
        };
        if (!payload.name) return;

        try {
            let res;
            if (form.editingId) {
                res = await fetch(`${apiBase}/${form.editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(apiBase, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            if (!res.ok) throw new Error("Save failed");
            await fetchItems();
            setForm({ name: "", price: "", description: "", editingId: null });
        } catch (err) {
            alert(err.message || "Failed to save");
        }
    }

    function startEdit(item) {
        setForm({
            name: item.name,
            price: String(item.price ?? ""),
            description: item.description ?? "",
            editingId: item.id ?? item._id,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(item) {
        if (!confirm(`Delete "${item.name}"?`)) return;
        try {
            const id = item.id ?? item._id;
            const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setItems((prev) => prev.filter((i) => (i.id ?? i._id) !== id));
        } catch (err) {
            alert(err.message || "Failed to delete");
        }
    }

    return (
        <div className="w-1/2 p-4 border-r">
            <h2 className="text-xl font-semibold mb-3">Menu Management</h2>

            <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <div>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                        {form.editingId ? "Update" : "Add"}
                    </button>
                    {form.editingId && (
                        <button
                            type="button"
                            onClick={() =>
                                setForm({
                                    name: "",
                                    price: "",
                                    description: "",
                                    editingId: null,
                                })
                            }
                            className="px-3 py-1 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <div>Loading menu...</div>
            ) : error ? (
                <div className="text-red-600">Error: {error}</div>
            ) : items.length === 0 ? (
                <div>No items found.</div>
            ) : (
                <ul className="space-y-2">
                    {items.map((item) => {
                        const id = item.id ?? item._id;
                        return (
                            <li
                                key={id}
                                className="p-2 border rounded flex justify-between items-start"
                            >
                                <div>
                                    <div className="font-medium">
                                        {item.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {item.description}
                                    </div>
                                    <div className="text-sm">
                                        Price: ${Number(item.price).toFixed(2)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="px-2 py-1 bg-yellow-300 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
