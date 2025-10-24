import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE } from "../../utils/api";

export default function AllUsers() {
    const { data, loading } = useFetch(`${API_BASE}/users`);

    if (loading) return <p className="text-center">Loading users...</p>;

    return (
        <motion.div
            className="p-6 h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-2xl text-white mb-8 font-semibold">
                All Users
            </h2>
            <table className="table-auto w-full text-white">
                <thead>
                    <tr className="border-2 text-xl border-gray-200 bg-[#404040]">
                        <th className="p-2 outline-1">ID</th>
                        <th className="outline-1">Username</th>
                        <th className="outline-1">Email</th>
                        <th className="outline-1">Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((u) => (
                        <tr
                            key={u.id}
                            className="border-2 border-gray-200 text-center text-lg"
                        >
                            <td className="p-2 outline-1">{u.id}</td>
                            <td className="outline-1">{u.username}</td>
                            <td className="outline-1">{u.email}</td>
                            <td className="outline-1">
                                {new Date(u.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
}
