import Button from "../../ui/Button.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { useCart } from "../../context/cartContex.jsx";

function MenuItem({ pizza }) {
    const { pizza_id, name, unit_price, ingredients, soldOut_status, img_url } =
        pizza;
    const { addToCart } = useCart();

    return (
        <li className="flex gap-4 py-2">
            <img
                src={img_url}
                alt={name}
                className={`h-24 w-24 object-cover ${
                    soldOut_status ? "opacity-70 grayscale" : ""
                }`}
            />
            <div className="flex items-center justify-between w-full">
                <div className="flex grow flex-col pt-0.5">
                    <p className="font-bold text-lg text-white">{name}</p>
                    <p className="text-sm capitalize italic text-neutral-300 font-bold">
                        {ingredients}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                        {!soldOut_status ? (
                            <p className="text-sm font-bold text-white">
                                {formatCurrency(unit_price)}
                            </p>
                        ) : (
                            <p className="text-sm font-medium uppercase text-slate-200">
                                Sold out
                            </p>
                        )}
                    </div>
                </div>

                {!soldOut_status && (
                    <Button type="small" onclick={() => addToCart(pizza_id)}>
                        Add to cart
                    </Button>
                )}
            </div>
        </li>
    );
}

export default MenuItem;
