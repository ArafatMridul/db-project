import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/Login";
import Register from "./pages/Register";
import Home from "./pages/main/Home";
import Menu from "./pages/menu/Menu";
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./context/cartContex";
import Order from "./pages/order/Order";
import OrdersPage from "./pages/order/OrdersPage";
import Admin from "./pages/admin/Admin";
import AllUsers from "./pages/admin/AllUsers";
import AllPizzas from "./pages/admin/AllPizzas";
import AdminLayout from "./pages/admin/AdminLayout";
import AddPizza from "./pages/admin/AddPizza";
import UserOrders from "./pages/admin/UserOrders";

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
                <Route path="/orders" element={<OrdersPage />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin"
                    element={
                        <AdminLayout>
                            <Admin />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/all-users"
                    element={
                        <AdminLayout>
                            <AllUsers />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/all-pizzas"
                    element={
                        <AdminLayout>
                            <AllPizzas />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/add-pizza"
                    element={
                        <AdminLayout>
                            <AddPizza />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <AdminLayout>
                            <UserOrders />
                        </AdminLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
