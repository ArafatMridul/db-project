import React from "react";

const OrderStats = ({ orderStats }) => {
    const stats = [
        {
            label: "Total",
            value: orderStats.total,
            color: "text-white",
            bgColor: "bg-neutral-800",
        },
        {
            label: "Pending",
            value: orderStats.pending,
            color: "text-yellow-600",
            bgColor: "bg-neutral-800",
        },
        {
            label: "Confirmed",
            value: orderStats.confirmed,
            color: "text-blue-600",
            bgColor: "bg-neutral-800",
        },
        {
            label: "Delivered",
            value: orderStats.delivered,
            color: "text-green-600",
            bgColor: "bg-neutral-800",
        },
        {
            label: "Cancelled",
            value: orderStats.cancelled,
            color: "text-red-600",
            bgColor: "bg-neutral-800",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`${stat.bgColor} p-4 rounded-lg text-center border-2 border-white`}
                >
                    <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                    </div>
                    <div className="text-sm text-white">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default OrderStats;
