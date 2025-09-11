import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./userContex";

const CartContext = createContext();

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState({
        totalItems: 0,
        totalAmount: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useUser();

    // Function to fetch cart data
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8800/api/cart", {
                withCredentials: true,
            });
            setCartItems(response.data.items);
            setCartSummary(response.data.summary);
        } catch (err) {
            console.error("Error fetching cart:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch cart data on component mount
    useEffect(() => {
        if (currentUser) {
            fetchCart();
        } else {
            setCartItems([]);
            setCartSummary({ totalItems: 0, totalAmount: 0 });
        }
    }, [currentUser]);

    // Function to add item to cart
    const addToCart = async (pizza_id, quantity = 1) => {
        try {
            await axios.post(
                "http://localhost:8800/api/cart/add",
                { pizza_id, quantity },
                { withCredentials: true }
            );

            // Refetch cart data to update state
            await fetchCart();

            return { success: true };
        } catch (err) {
            console.error("Error adding to cart:", err);
            return {
                success: false,
                error: err.response?.data || "Failed to add item",
            };
        }
    };

    // Update cart item quantity
    const handleUpdateQuantity = async (cartItemId, updateData) => {
        try {
            if (updateData.quantity < 1) {
                throw new Error("Quantity must be at least 1");
            }

            const response = await axios.put(
                `http://localhost:8800/api/cart/item/${cartItemId}`,
                {
                    quantity: updateData.quantity,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Update local state
                setCartItems((prevCart) => {
                    const updated = prevCart.map((item) =>
                        item.cart_item_id === cartItemId
                            ? {
                                  ...item,
                                  quantity: updateData.quantity,
                                  total_price:
                                      item.unit_price * updateData.quantity,
                              }
                            : item
                    );

                    // 🔥 Recalculate summary here
                    const totalItems = updated.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );
                    const totalAmount = updated
                        .reduce(
                            (sum, item) => sum + Number(item.total_price),
                            0
                        )
                        .toFixed(2);

                    setCartSummary({
                        totalItems,
                        totalAmount,
                    });

                    return updated;
                });

                return { success: true, message: response.data };
            }
        } catch (err) {
            const errorMessage =
                err.response?.data ||
                err.message ||
                "Failed to update cart item";
            console.error("Error updating cart item:", err);

            // Revert optimistic update
            await fetchCart();

            return { success: false, error: errorMessage };
        }
    };

    // Function to remove individual item
    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(
                `http://localhost:8800/api/cart/item/${itemId}`,
                { withCredentials: true }
            );

            // Update local state by removing the item
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.cart_item_id !== itemId)
            );

            // Update cart summary
            const updatedItems = cartItems.filter(
                (item) => item.cart_item_id !== itemId
            );
            const newTotalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const newTotalAmount = updatedItems.reduce(
                (sum, item) => sum + Number(item.total_price),
                0
            );

            setCartSummary({
                totalItems: newTotalItems,
                totalAmount: newTotalAmount,
            });
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    // Function to clear entire cart
    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) {
            return;
        }

        try {
            await axios.delete("http://localhost:8800/api/cart/clear", {
                withCredentials: true,
            });

            // Clear local state
            setCartItems([]);
            setCartSummary({
                totalItems: 0,
                totalAmount: 0,
            });
        } catch (err) {
            console.error("Error clearing cart:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartSummary,
                handleClearCart,
                handleRemoveItem,
                handleUpdateQuantity,
                addToCart,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("CartContext used outside the CartProvider");

    return context;
}

export { CartProvider, useCart };
