import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0,
        cancelled: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    // API base URL
    const API_BASE = 'http://localhost:8800/api';

    // Axios instance with credentials
    const api = axios.create({
        baseURL: API_BASE,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Calculate order statistics
    const calculateOrderStats = useCallback((ordersList) => {
        const stats = {
            total: ordersList.length,
            pending: 0,
            confirmed: 0,
            delivered: 0,
            cancelled: 0
        };

        ordersList.forEach(order => {
            if (Object.prototype.hasOwnProperty.call(stats, order.status)) {
                stats[order.status]++;
            }
        });

        setOrderStats(stats);
    }, []);

    // Create order from cart
    const createOrder = useCallback(async (orderData) => {
        setIsCreatingOrder(true);
        try {
            const response = await api.post('/order', orderData);
            
            if (response.status === 201) {
                // Refresh orders after successful creation
                await fetchUserOrders();
                return { 
                    success: true, 
                    data: response.data 
                };
            }
        } catch (error) {
            console.error('Error creating order:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Failed to create order' 
            };
        } finally {
            setIsCreatingOrder(false);
        }
    }, []);

    // Fetch user orders
    const fetchUserOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/order');
            
            if (response.status === 200) {
                const fetchedOrders = response.data.orders || [];
                setOrders(fetchedOrders);
                calculateOrderStats(fetchedOrders);
                return { success: true, data: fetchedOrders };
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
            setOrderStats({
                total: 0,
                pending: 0,
                confirmed: 0,
                delivered: 0,
                cancelled: 0
            });
            return { 
                success: false, 
                error: error.response?.data || 'Failed to fetch orders' 
            };
        } finally {
            setIsLoading(false);
        }
    }, [calculateOrderStats]);

    // Get specific order by ID
    const getOrderById = useCallback(async (orderId) => {
        try {
            const response = await api.get(`/order/${orderId}`);
            
            if (response.status === 200) {
                return { 
                    success: true, 
                    data: response.data.order 
                };
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Failed to fetch order' 
            };
        }
    }, []);

    // Update order status
    const updateOrderStatus = useCallback(async (orderId, status) => {
        try {
            const response = await api.put(`/order/${orderId}/status`, { status });
            
            if (response.status === 200) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.order_id === orderId 
                            ? { ...order, status } 
                            : order
                    )
                );
                
                // Recalculate stats
                const updatedOrders = orders.map(order => 
                    order.order_id === orderId 
                        ? { ...order, status } 
                        : order
                );
                calculateOrderStats(updatedOrders);
                
                return { success: true };
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Failed to update order status' 
            };
        }
    }, [orders, calculateOrderStats]);

    // Cancel order
    const cancelOrder = useCallback(async (orderId) => {
        try {
            const response = await api.put(`/order/${orderId}/cancel`);
            
            if (response.status === 200) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.order_id === orderId 
                            ? { ...order, status: 'cancelled' } 
                            : order
                    )
                );
                
                // Recalculate stats
                const updatedOrders = orders.map(order => 
                    order.order_id === orderId 
                        ? { ...order, status: 'cancelled' } 
                        : order
                );
                calculateOrderStats(updatedOrders);
                
                return { success: true, cancelled: true };
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            
            // Handle different error response formats
            let errorMessage = 'Failed to cancel order';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                cancelled: false,
                error: errorMessage 
            };
        }
    }, [orders, calculateOrderStats]);

    // Clear orders (for logout)
    const clearOrders = useCallback(() => {
        setOrders([]);
        setOrderStats({
            total: 0,
            pending: 0,
            confirmed: 0,
            delivered: 0,
            cancelled: 0
        });
    }, []);

    const value = {
        // State
        orders,
        orderStats,
        isLoading,
        isCreatingOrder,
        
        // Actions
        createOrder,
        fetchUserOrders,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
        clearOrders
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};