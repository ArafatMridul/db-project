import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

function CartOverview({ summary }) {
    const { totalItems, totalAmount } = summary;
    return (
        <AnimatePresence mode="wait">
            {totalAmount > 0 && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed bottom-0 container left-1/2 -translate-x-1/2"
                >
                    <div className="flex items-center justify-between bg-yellow-400 px-16 py-6 text-lg capitalize text-stone-200">
                        <p className="space-x-4 font-semibold text-neutral-900 sm:space-x-6">
                            <span>{totalItems} pizzas</span>
                            <span>${totalAmount}</span>
                        </p>
                        <Link
                            to="/cart"
                            className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:bg-neutral-900 after:h-1 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full after:rounded-lg text-neutral-900 font-bold"
                        >
                            Open cart &rarr;
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CartOverview;
