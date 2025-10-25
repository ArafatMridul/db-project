import React, { useEffect, useState } from "react";
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
    const { cartSummary } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            const res = await axios.get("http://localhost:8800/api/menu");
            setMenu(res.data);
        };
        fetchMenu();
    }, []);

    console.log(cartSummary);

    return (
        <>
            <Navbar />
            <div className="bg-bl">
                <div className="container pb-25 pt-4">
                    <ul className="divide-y divide-stone-200 px-2">
                        {menu.map((pizza, index) => (
                            <MenuItem pizza={pizza} key={index} />
                        ))}
                    </ul>
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
