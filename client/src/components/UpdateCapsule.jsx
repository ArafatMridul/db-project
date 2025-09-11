import React from "react";
import { useCart } from "../context/cartContex";

const UpdateCapsule = ({ quantity, cart_item_id }) => {
    const { handleUpdateQuantity } = useCart();
    const handleDecrease = async () => {
        if (quantity <= 1) return;
        try {
            const result = await handleUpdateQuantity(cart_item_id, {
                quantity: quantity - 1,
            });
            if (!result.success)
                console.error("Failed to decrease:", result.error);
        } catch (error) {
            console.error("Error decreasing:", error);
        }
    };

    const handleIncrease = async () => {
        try {
            const result = await handleUpdateQuantity(cart_item_id, {
                quantity: quantity + 1,
            });
            if (!result.success)
                console.error("Failed to increase:", result.error);
        } catch (error) {
            console.error("Error increasing:", error);
        }
    };
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={handleDecrease}
                className="cursor-pointer bg-yellow-400 shrink-0 size-7 rounded-full flex items-center justify-center font-bold"
            >
                -
            </button>
            <p className="text-white">{quantity}</p>
            <button
                onClick={handleIncrease}
                className="cursor-pointer bg-yellow-400 shrink-0 size-7 rounded-full flex items-center justify-center font-bold"
            >
                +
            </button>
        </div>
    );
};

export default UpdateCapsule;
