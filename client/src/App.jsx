import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/main/Home";
import Menu from "./pages/menu/Menu";
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./context/cartContex";
import Order from "./pages/order/Order";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
