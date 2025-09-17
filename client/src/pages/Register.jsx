// src/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    console.log(inputs);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8800/api/auth/register", inputs);
            navigate("/login");
        } catch (err) {
            setErr(err.response.data);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bl">
            <div className="bg-transparent p-8 rounded-xl border border-white w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Register
                </h2>
                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-white font-bold text-lg mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
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
                            htmlFor="email"
                            className="block text-white font-bold text-lg mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            name="email"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white/50 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-white font-bold text-lg mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white/50 text-white"
                            required
                        />
                    </div>
                    {err && (
                        <div>
                            <p>{err}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-bl text-white py-2 rounded-lg hover:bg-neutral-300 hover:text-bl font-extrabold transition-colors duration-300 cursor-pointer border border-white mt-2"
                    >
                        Register
                    </button>
                </form>
                <p className="text-sm text-center text-white mt-4 font-bold">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-white relative after:absolute after:left-0 after:-bottom-0 after:w-full after:bg-white after:h-0.5 after:transition-all after:duration-500 after:ease-in-out hover:after:-bottom-1 after:rounded-lg"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
