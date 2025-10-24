import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE, headers } from "../../utils/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        console.log(data)
        if(data.success) {
            localStorage.setItem("admin_token", data.token);
            window.location.href = "/admin";
        }
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-2xl mb-6 font-semibold">Admin Login</h2>
            <form className="flex flex-col gap-4 w-80" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    className="p-2 rounded bg-gray-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 rounded bg-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 py-2 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
        </motion.div>
    );
}
