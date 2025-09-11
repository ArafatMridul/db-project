import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContex";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

const Navbar = ({ transparent }) => {
    const [open, setOpen] = useState(false);
    const { currentUser, logout } = useUser();
    return (
        <>
            <header
                className={twMerge(
                    "bg-yellow-400 fixed top-0 left-0 right-0 z-50",
                    transparent && "bg-transparent"
                )}
            >
                <div className="container flex items-center justify-between px-4 py-6 capitalize sm:px-6">
                    <div className="flex items-center gap-4">
                        <img src="/pizza.svg" alt="" className="size-8" />
                        <Link
                            to="/"
                            className={twMerge(
                                "text-xl font-bold",
                                transparent && "text-white"
                            )}
                        >
                            Pizza Ristorante
                        </Link>
                    </div>

                    <img
                        src="/user.svg"
                        alt=""
                        className="size-6 cursor-pointer"
                        onClick={() => setOpen(true)}
                    />
                </div>

                {/* SLIDEBAR */}
                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                className="fixed inset-0 z-30 bg-black/70"
                            ></motion.div>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 500 }}
                                exit={{ width: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                className="fixed top-0 left-0 bottom-0 bg-white z-50 overflow-clip"
                            >
                                <div className="px-16 py-10 w-[500px]">
                                    <div className="flex items-center justify-end">
                                        <img
                                            src="/close.svg"
                                            alt=""
                                            className="size-8 cursor-pointer"
                                            onClick={() => setOpen(false)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-10">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <img
                                                    src="/user.svg"
                                                    alt=""
                                                    className="size-9"
                                                />
                                            </div>
                                            <div>
                                                <div>
                                                    <img
                                                        src="/user.jsx"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="font-bold text-lg">
                                                    <p>
                                                        {currentUser
                                                            ? "Welcome,"
                                                            : "Login To,"}
                                                    </p>
                                                    <p className="capitalize text-yellow-400">
                                                        {currentUser
                                                            ? currentUser.username
                                                            : "Explore Menu"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {currentUser ? (
                                            <Link
                                                className="font-bold bg-yellow-400 px-6 py-2 rounded-md cursor-pointer hover:bg-yellow-300 transition-colors duration-300 ease-in-out"
                                                to="/"
                                                onClick={() => logout()}
                                            >
                                                Logout
                                            </Link>
                                        ) : (
                                            <Link
                                                className="font-bold bg-yellow-400 px-6 py-2 rounded-md cursor-pointer hover:bg-yellow-300 transition-colors duration-300 ease-in-out"
                                                to="/login"
                                            >
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                    <div className="flex justify-center flex-col gap-6 mt-18 font-bold text-3xl">
                                        <div>
                                            <Link
                                                to={
                                                    currentUser
                                                        ? "/menu"
                                                        : "/login"
                                                }
                                                className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:bg-black after:h-1 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full after:rounded-lg"
                                            >
                                                Explore Our Menu
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                to="/order"
                                                className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:bg-black after:h-1 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full after:rounded-lg"
                                            >
                                                Check Order History
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>
            <div className="w-full h-[80px]"></div>
        </>
    );
};

export default Navbar;
