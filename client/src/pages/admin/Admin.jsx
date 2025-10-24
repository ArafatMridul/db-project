import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE } from "../../utils/api";

export default function AdminDashboard() {
    const { data: users } = useFetch(`${API_BASE}/users`);
    const { data: pizzas } = useFetch(`${API_BASE}/all-pizzas`);
    const {data: totalOrders} = useFetch(`${API_BASE}/orders/total`);

    const stats = [
        {
            label: "Total Users",
            value: users?.length || 0,
            icon: "👥",
            trend: "+12%",
        },
        {
            label: "Total Pizzas",
            value: pizzas?.length || 0,
            icon: "🍕",
            trend: "+8%",
        },
        {
            label: "Total Orders",
            value: totalOrders?.total || 0,
            icon: "📦",
            trend: "+23%",
        },
    ];

    const cards = [
        {
            label: "View All Users",
            description: "Manage user accounts and permissions",
            path: "/admin/all-users",
            icon: "👥",
        },
        {
            label: "View All Pizzas",
            description: "Edit and manage pizza menu items",
            path: "/admin/all-pizzas",
            icon: "🍕",
        },
        {
            label: "Add Pizza",
            description: "Create a new pizza item",
            path: "/admin/add-pizza",
            icon: "➕",
        },
        {
            label: "Manage Orders",
            description: "Track and manage customer orders",
            path: "/admin/orders",
            icon: "📋",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.div
            className="min-h-screen p-8 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-5xl font-black text-white mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-300 text-lg">
                    Welcome back! Here's your restaurant overview
                </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                className="grid md:grid-cols-3 gap-6 mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ translateY: -5 }}
                        className={`relative overflow-hidden rounded-2xl p-8 border-2 border-grey-200`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{stat.icon}</span>
                                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-white/80 text-sm font-medium mb-2">
                                {stat.label}
                            </p>
                            <p className="text-5xl font-extrabold">
                                {stat.value}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-3xl font-bold text-white">Quick Actions</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full mt-2"></div>
            </motion.div>

            {/* Action Cards */}
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {cards.map((card, idx) => (
                    <Link key={idx} to={card.path}>
                        <motion.div
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.35)",
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                },
                            }}
                            className={`group relative h-44 border-2 border-grey-200 rounded-2xl overflow-hidden cursor-pointer`}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-150"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16"></div>

                            <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
                                <div>
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-5xl block mb-3 origin-left"
                                    >
                                        {card.icon}
                                    </motion.span>
                                    <h3 className="text-xl font-bold mb-1">
                                        {card.label}
                                    </h3>
                                    <p className="text-sm text-white/80 line-clamp-2">
                                        {card.description}
                                    </p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center text-sm font-semibold"
                                >
                                    Access →
                                </motion.div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
}
