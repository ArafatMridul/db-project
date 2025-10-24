import { motion } from "framer-motion";

export default function AdminNavbar({ toggleSidebar }) {
    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
    };

    return (
        <motion.nav
            className="border-t-2 border-b-2 border-r-2 border-gray-200 shadow p-4 flex justify-between items-center bg-[#404040]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <button
                className="text-white text-2xl md:hidden"
                onClick={toggleSidebar}
            >
                ☰
            </button>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <div className="flex items-center gap-4">
                <span className="text-white">Welcome, Admin</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </motion.nav>
    );
}
