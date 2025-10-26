import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import MenuItem from "./MenuItem";
import CartOverview from "../cart/CartOverview";
import { useCart } from "../../context/cartContex";
import ExplainCode from "../../components/ExplainCode";
import { fetchMenuQuerry } from "../../utils/SQLQuerries";

const queries = {
    "Fetch Menu Query": fetchMenuQuerry,
};

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { cartSummary } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/menu");
                setMenu(res.data);
            } catch (err) {
                console.error("Error fetching menu:", err);
            }
        };
        fetchMenu();
    }, []);

    // Filter pizzas by name or ingredients
    const filteredMenu = useMemo(() => {
        if (!searchTerm.trim()) return menu;

        const lower = searchTerm.toLowerCase();

        return menu.filter(
            (pizza) =>
                pizza.name.toLowerCase().includes(lower) ||
                (pizza.ingredients &&
                    pizza.ingredients.toLowerCase().includes(lower))
        );
    }, [menu, searchTerm]);

    return (
        <>
            <Navbar />
            <div className="bg-bl min-h-screen">
                <div className="container pb-25 pt-4">
                    <div className="flex justify-center mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search pizzas by name or ingredients..."
                            className="w-full md:w-2/3 py-2 px-4 text-lg ring-2 ring-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white text-white"
                        />
                    </div>

                    {/* 🍕 Filtered Menu List */}
                    <ul className="divide-y divide-stone-200 px-2">
                        {filteredMenu.length > 0 ? (
                            filteredMenu.map((pizza, index) => (
                                <MenuItem pizza={pizza} key={index} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No pizzas match your search.
                            </p>
                        )}
                    </ul>

                    {/* 🛒 Show Cart Overview if items exist */}
                    {cartSummary.totalItems > 0 && (
                        <CartOverview summary={cartSummary} />
                    )}
                </div>
            </div>
            <ExplainCode queries={queries} />
        </>
    );
};

export default Menu;
