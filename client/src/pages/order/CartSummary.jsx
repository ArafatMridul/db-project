import React from "react";
import { useCart } from "../../context/cartContex";

const CartSummary = () => {
    const { cartItems, cartSummary, isLoading } = useCart();
    return (
        <div className="bg-bl border-2 border-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-extrabold mb-4 text-white">
                Order Summary
            </h2>

            {isLoading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                    <p className="text-white mt-2">Loading cart...</p>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-white mb-4">
                        <svg
                            className="w-12 h-12 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8h9"
                            ></path>
                        </svg>
                    </div>
                    <p className="text-white">Your cart is empty</p>
                    <p className="text-sm text-slate-200 mt-1">
                        Add some pizzas to place an order
                    </p>
                </div>
            ) : (
                <div>
                    <div className="space-y-3 mb-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.cart_item_id}
                                className="flex items-center space-x-3 p-3 border border-white rounded-lg"
                            >
                                <img
                                    src={
                                        item.img_url || "/placeholder-pizza.jpg"
                                    }
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-pizza.jpg";
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-white">
                                        {item.name}
                                    </h4>
                                    {item.ingredients && (
                                        <p className="text-xs text-slate-200 truncate">
                                            {item.ingredients}
                                        </p>
                                    )}
                                    <p className="text-xs text-white">
                                        {item.quantity} × $
                                        {parseFloat(item.unit_price).toFixed(2)}{" "}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-white">
                                        $
                                        {parseFloat(item.total_price).toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white">
                                Items ({cartSummary.totalItems})
                            </span>
                            <span className="text-white font-extrabold">
                                $
                                {parseFloat(cartSummary.totalAmount).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white">Delivery Fee</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span className="text-white font-extrabold">Total</span>
                            <span className="text-yellow-400">
                                $
                                {parseFloat(cartSummary.totalAmount).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartSummary;
