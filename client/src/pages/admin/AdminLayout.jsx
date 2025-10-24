import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

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
        </div>
    );
}
