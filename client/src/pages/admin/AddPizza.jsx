import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE, headers } from "../../utils/api";
import { useFetch } from "../../hooks/useFetch";

export default function AddPizza() {
    const { data: ingredientsData, loading } = useFetch(
        `${API_BASE}/all-ingredients`
    );
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [form, setForm] = useState({
        name: "",
        unit_price: "",
        img_url: "",
        ingredients: [],
    });
    const [newIngredient, setNewIngredient] = useState("");
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (ingredientsData) {
            const ingredients = ingredientsData.map((ing) => ing);
            setAvailableIngredients(ingredients);
        }
    }, [ingredientsData]);

    const handleSelectIngredient = (ingredient) => {
        setDropdownOpen(false);
        if (form.ingredients.includes(ingredient.name)) return; // already selected
        setForm({
            ...form,
            ingredients: [...form.ingredients, ingredient.name],
        });
    };

    const handleAddNewIngredient = () => {
        const trimmed = newIngredient.trim().toLowerCase();
        if (!trimmed) return;

        // Check if it already exists
        const exists =
            availableIngredients.some(
                (ing) => ing.name.toLowerCase() === trimmed
            ) || form.ingredients.includes(trimmed);

        if (exists) {
            setError("⚠️ Ingredient already exists in the list!");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setForm({ ...form, ingredients: [...form.ingredients, trimmed] });
        setNewIngredient("");
    };

    const handleRemoveIngredient = (name) => {
        setForm({
            ...form,
            ingredients: form.ingredients.filter((ing) => ing !== name),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.unit_price || form.ingredients.length === 0) {
            alert("Please fill all fields and select at least one ingredient!");
            return;
        }

        const res = await fetch(`${API_BASE}/add-pizza`, {
            method: "POST",
            headers,
            body: JSON.stringify(form),
        });
        const data = await res.json();
        alert(data.message || "Pizza added successfully!");
        setForm({ name: "", unit_price: "", img_url: "", ingredients: [] });
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto mt-10 p-6 border-2 border-gray-200 shadow-xl rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-3xl mb-4 font-semibold text-white">
                🍕 Add New Pizza
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Pizza Info */}
                <input
                    placeholder="Pizza Name"
                    className="p-2 border-2 border-gray-200 rounded placeholder:text-white text-white"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Unit Price"
                    type="number"
                    className="p-2 border-2 border-gray-200 rounded placeholder:text-white text-white"
                    value={form.unit_price}
                    onChange={(e) =>
                        setForm({ ...form, unit_price: e.target.value })
                    }
                />
                <input
                    placeholder="Image URL"
                    className="p-2 border-2 border-gray-200 rounded placeholder:text-white text-white"
                    value={form.img_url}
                    onChange={(e) =>
                        setForm({ ...form, img_url: e.target.value })
                    }
                />

                {/* Ingredient Selector */}
                <div className="relative">
                    <button
                        type="button"
                        className="bg-[#404040] border-2 border-gray-200 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {dropdownOpen
                            ? "Hide Ingredients"
                            : "See All Ingredients"}
                    </button>

                    {dropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 bg-white border-2 border-gray-200 shadow-md rounded mt-2 max-h-60 overflow-y-auto w-full"
                        >
                            {loading ? (
                                <p className="p-3 text-gray-500">
                                    Loading ingredients...
                                </p>
                            ) : (
                                availableIngredients.map((ing) => (
                                    <div
                                        key={ing.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleSelectIngredient(ing)
                                        }
                                    >
                                        {ing.name}
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Selected Ingredients */}
                {form.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {form.ingredients.map((ing, idx) => (
                            <span
                                key={idx}
                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1"
                            >
                                {ing}
                                <button
                                    type="button"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleRemoveIngredient(ing)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Add new ingredient manually */}
                <div className="flex gap-2 mt-3">
                    <input
                        placeholder="Add new ingredient"
                        className="p-2 border-2 border-gray-200 flex-1 rounded text-white placeholder:text-white"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                    />
                    <button
                        type="button"
                        className="bg-[#404040] border-2 border-gray-200 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                        onClick={handleAddNewIngredient}
                    >
                        Add
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-500 border-2 border-gray-200 font-extrabold text-lg text-white py-2 rounded hover:bg-green-400 mt-4"
                >
                    Save Pizza
                </button>
            </form>
        </motion.div>
    );
}
