// src/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContex";

export default function Login() {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate("/");
        } catch (err) {
            console.log("Full error object:", err);
            console.log("Error message:", err.message);
            console.log("Error response:", err.response);

            if (err.response) {
                setErr(err.response.data);
            } else if (err.request) {
                setErr("No response from server. Check if backend is running.");
            } else {
                setErr("Request failed: " + err.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bl">
            <div className="bg-transparent p-8 rounded-xl border border-white shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Login
                </h2>
                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-white mb-1 font-bold text-lg"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="username"
                            name="username"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white/50 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-1 text-white font-bold text-lg"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder:text-white/50"
                            required
                        />
                    </div>
                    {err && (
                        <div>
                            <p className="text-white font-extrabold">{err}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-bl text-white py-2 rounded-lg hover:bg-neutral-300 hover:text-bl transition-colors cursor-pointer duration-300 ease-in-out font-bold text-lg border border-white mt-2"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-sm text-center text-white mt-4 font-bold">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-white relative after:absolute after:left-0 after:-bottom-0 after:w-full after:bg-white after:h-0.5 after:transition-all after:duration-500 after:ease-in-out hover:after:-bottom-1 after:rounded-lg"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
