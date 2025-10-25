import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import ExplainCode from "../../components/ExplainCode";
import { adminQuery } from "../../utils/SQLQuerries";

const adminQueries = {
    "Get All Users": adminQuery.getAllUsersQuery,
    "Get All Pizzas": adminQuery.getAllPizzasQuery,
    "Add New Pizza": adminQuery.addNewPizzaQuery,
    "Mark Pizza as Sold Out": adminQuery.markPizzaAsSoldOutQuery,
    "Get User Orders": adminQuery.getUserOrdersQuery,
    "Update Order Status": adminQuery.updateOrderStatusQuery,
};

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex bg-[#212121] overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 h-screen">
                <AdminNavbar
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <motion.main
                    className="flex-1 p-6 h-full overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {children}
                </motion.main>
            </div>

            <ExplainCode queries={adminQueries} />
        </div>
    );
}
