import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isOpen }) {
    const location = useLocation();

    const links = [
        { name: "Dashboard", path: "/admin" },
        { name: "All Users", path: "/admin/all-users" },
        { name: "All Pizzas", path: "/admin/all-pizzas" },
        { name: "Add Pizza", path: "/admin/add-pizza" },
        { name: "Orders", path: "/admin/orders" }, // example
    ];

    return (
        <motion.aside
            className={`border-2 border-grey-200 text-white w-64 flex-shrink-0 ${
                isOpen ? "block" : "hidden md:block"
            }`}
            initial={{ x: -200 }}
            animate={{ x: isOpen ? 0 : -200 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="px-6 py-4 text-2xl font-bold border-b-2 border-gray-200 bg-[#404040]">
                🍕 Pizza Admin
            </div>
            <nav className="flex flex-col gap-1">
                {links.map((link, idx) => (
                    <Link
                        key={idx}
                        to={link.path}
                        className={`py-2 px-6 transition-all duration-300 ease-in-out ${
                            location.pathname === link.path
                                ? "ring-2 ring-grey-200 bg-[#404040] pl-8"
                                : "hover:bg-gray-600"
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </motion.aside>
    );
}
