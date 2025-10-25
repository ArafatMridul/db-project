import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ExplainCode = ({ queries }) => {
    const [clicked, setClicked] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(
        Object.keys(queries)[0] // default to first
    );

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Floating Button */}
            <div onClick={() => setClicked((prev) => !prev)}>
                <img
                    src="/question.svg"
                    alt="Explain Code"
                    className="size-14 cursor-pointer hover:scale-110 transition-transform duration-200"
                />
            </div>

            {/* Expandable Code Viewer */}
            <AnimatePresence mode="wait">
                {clicked && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed bottom-32 right-8 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="w-[750px] p-6">
                            {/* Dropdown to select query */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold text-lg">
                                    SQL Query Viewer
                                </h3>
                                <select
                                    value={selectedQuery}
                                    onChange={(e) =>
                                        setSelectedQuery(e.target.value)
                                    }
                                    className="bg-gray-800/50 text-white border border-gray-600 rounded-md px-3 py-1 text-sm"
                                >
                                    {Object.keys(queries).map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <pre className="text-white font-mono text-sm whitespace-pre-wrap leading-6">
                                {queries[selectedQuery]}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExplainCode;
