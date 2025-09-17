import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/userContex.jsx";
import { CartProvider } from "./context/cartContex.jsx";
import { OrderProvider } from "./context/orderContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <CartProvider>
                <OrderProvider>
                    <App />
                </OrderProvider>
            </CartProvider>
        </UserProvider>
    </StrictMode>
);
