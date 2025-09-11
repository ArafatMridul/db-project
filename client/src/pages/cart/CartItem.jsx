import React from "react";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";
import UpdateCapsule from "../../components/UpdateCapsule";

const CartItem = ({ item, onRemove }) => {
    const { cart_item_id, img_url, name, quantity, total_price } = item;

    const handleRemoveItem = () => {
        onRemove(cart_item_id);
    };

    return (
        <li className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <img
                    src={img_url}
                    alt={name}
                    className="size-20 rounded object-cover"
                />
                <div>
                    <p className="mb-1 font-medium text-white">
                        {quantity} &times; {name}
                    </p>
                    <p className="text-sm text-white">
                        ${(total_price / quantity).toFixed(2)} each
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between sm:gap-6">
                {quantity && (
                    <UpdateCapsule
                        quantity={quantity}
                        cart_item_id={cart_item_id}
                    />
                )}
                <p className="text-sm font-bold text-white">
                    {formatCurrency(total_price)}
                </p>
                <Button type="small" onclick={handleRemoveItem}>
                    Delete
                </Button>
            </div>
        </li>
    );
};

export default CartItem;
