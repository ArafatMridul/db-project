import CartItem from "./CartItem";
import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import ExplainCode from "../../components/ExplainCode";
import { useCart } from "../../context/cartContex";
import { useUser } from "../../context/userContex";
import { cartQuery } from "../../utils/SQLQuerries";

export const cartQueries = {
    "Get Cart ID": cartQuery.getCartIdQuery,
    "Create Cart": cartQuery.createCartQuery,
    "Check Pizza Exists": cartQuery.checkPizzaExistsQuery,
    "Check Cart Item": cartQuery.checkCartItemQuery,
    "Update Cart Item Quantity": cartQuery.updateCartItemQuantityQuery,
    "Add Cart Item": cartQuery.addCartItemQuery,
    "Get Cart Items": cartQuery.getCartItemsQuery,
    "Verify Cart Item Ownership": cartQuery.verifyCartItemOwnershipQuery,
    "Update Cart Item": cartQuery.updateCartItemQuantityQuery,
    "Delete Cart Item": cartQuery.deleteCartItemQuery,
    "Clear Cart": cartQuery.clearCartQuery,
    "Get Cart Count": cartQuery.getCartCountQuery,
};

const Cart = () => {
    const { currentUser } = useUser();
    const {
        isLoading,
        cartItems,
        cartSummary,
        handleClearCart,
        handleRemoveItem,
    } = useCart();

    if (isLoading) {
        return <div className="container px-4 py-3">Loading cart...</div>;
    }

    console.log(cartItems);

    return (
        <>
            <div className="bg-bl h-screen">
                <div className="bg-bl h-fit pb-10">
                    <div className="bg-yellow-400 py-6">
                        <div className="container">
                            <LinkButton to="/menu">Back to Menu</LinkButton>
                        </div>
                    </div>
                    <div className="container">
                        <h2 className="mt-7 text-3xl font-semibold capitalize text-white">
                            Your cart, {currentUser?.username}
                        </h2>

                        {cartItems.length === 0 ? (
                            <div className="mt-7">
                                <p className="text-white mb-6 text-xl">
                                    Your cart is empty. Start adding some
                                    pizzas!
                                </p>
                                <LinkButton
                                    to="/menu"
                                    ex="text-white after:bg-white"
                                >
                                    Go to menu
                                </LinkButton>
                            </div>
                        ) : (
                            <>
                                <ul className="mt-3 divide-y divide-stone-200 border-b">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            item={item}
                                            key={item.cart_item_id}
                                            onRemove={handleRemoveItem}
                                        />
                                    ))}
                                </ul>

                                {/* Cart Summary */}
                                <div className="mt-4 space-y-2 p-4 rounded-lg bg-yellow-400">
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            Total Items:
                                        </span>{" "}
                                        {cartSummary.totalItems}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        <span>Total Amount:</span> $
                                        {Number(
                                            cartSummary.totalAmount
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <div className="mt-6 space-x-2">
                                    <Button to="/order" type="primary">
                                        Make an Order!
                                    </Button>

                                    <Button
                                        type="secondary"
                                        onclick={handleClearCart}
                                    >
                                        Clear cart
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ExplainCode queries={cartQueries} />
        </>
    );
};

export default Cart;
