// Menu query
export const fetchMenuQuerry = `
    SELECT
        p.*,
        ingredients
    FROM pizza_menu p
    JOIN (
        SELECT 
            pizza_id,
            GROUP_CONCAT(NAME SEPARATOR ', ') AS ingredients
        FROM pizza_ingredients p
        JOIN ingredients i
        ON p.ingredient_id = i.ingredient_id
        GROUP BY pizza_id
    ) i
    on p.pizza_id = i.pizza_id
`;

// Cart query
export const cartQuery = {
    getCartIdQuery: `
    SELECT cart_id FROM cart WHERE user_id = ?;
    -- params: [user_id]
  `,

    createCartQuery: `
    INSERT INTO cart (user_id) VALUES (?);
    -- params: [user_id]
  `,

    checkPizzaExistsQuery: `
    SELECT pizza_id FROM pizza_menu WHERE pizza_id = ?;
    -- params: [pizza_id]
  `,

    checkCartItemQuery: `
    SELECT * FROM cart_items WHERE cart_id = ? AND pizza_id = ?;
    -- params: [cart_id, pizza_id]
  `,

    updateCartItemQuantityQuery: `
    UPDATE cart_items 
    SET quantity = quantity + ? 
    WHERE cart_id = ? AND pizza_id = ?;
    -- params: [quantity, cart_id, pizza_id]
  `,

    addCartItemQuery: `
    INSERT INTO cart_items (cart_id, pizza_id, quantity) 
    VALUES (?, ?, ?);
    -- params: [cart_id, pizza_id, quantity]
  `,

    getCartItemsQuery: `
    SELECT 
        ci.cart_item_id,
        ci.pizza_id,
        ci.quantity,
        p.name,
        p.unit_price,
        p.img_url,
        (ci.quantity * p.unit_price) AS total_price,
        GROUP_CONCAT(i.name SEPARATOR ', ') AS ingredients
    FROM cart c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN pizza_menu p ON ci.pizza_id = p.pizza_id
    LEFT JOIN pizza_ingredients pi ON p.pizza_id = pi.pizza_id
    LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
    WHERE c.user_id = ?
    GROUP BY ci.cart_item_id, ci.pizza_id, ci.quantity, p.name, p.unit_price, p.img_url
    ORDER BY ci.added_at DESC;
    -- params: [user_id]
  `,

    verifyCartItemOwnershipQuery: `
    SELECT ci.cart_item_id 
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.cart_id
    WHERE ci.cart_item_id = ? AND c.user_id = ?;
    -- params: [cart_item_id, user_id]
  `,

    updateCartItemQuery: `
    UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?;
    -- params: [quantity, cart_item_id]
  `,

    deleteCartItemQuery: `
    DELETE FROM cart_items WHERE cart_item_id = ?;
    -- params: [cart_item_id]
  `,

    clearCartQuery: `
    DELETE ci 
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.cart_id
    WHERE c.user_id = ?;
    -- params: [user_id]
  `,

    getCartCountQuery: `
    SELECT COALESCE(SUM(ci.quantity), 0) AS count
    FROM cart c
    LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
    WHERE c.user_id = ?;
    -- params: [user_id]
  `,
};

// Order query
export const orders = {
    getUserInfoQuery: `
        SELECT username, email FROM users WHERE id = ?;
        -- params: [userId]
    `,

    getCartItemsForOrderQuery: `
        SELECT 
            ci.pizza_id, 
            ci.quantity, 
            pm.unit_price, 
            pm.name AS pizza_name,
            pm.soldOut_status
        FROM cart c
        JOIN cart_items ci ON c.cart_id = ci.cart_id
        JOIN pizza_menu pm ON ci.pizza_id = pm.pizza_id
        WHERE c.user_id = ?;
        -- params: [userId]
    `,

    createOrderQuery: `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES (?, ?, ?);
        -- params: [userId, totalAmount, status]
    `,

    insertOrderItemQuery: `
        INSERT INTO order_items (order_id, pizza_id, quantity)
        VALUES (?, ?, ?);
        -- params: [orderId, pizzaId, quantity]
    `,

    insertOrderInfoQuery: `
        INSERT INTO order_info (order_id, name, email, address, phone_number)
        VALUES (?, ?, ?, ?, ?);
        -- params: [orderId, name, email, address, phone_number]
    `,

    clearCartAfterOrderQuery: `
        DELETE ci 
        FROM cart_items ci
        JOIN cart c ON ci.cart_id = c.cart_id
        WHERE c.user_id = ?;
        -- params: [userId]
    `,

    getUserOrdersQuery: `
        SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            oi.name,
            oi.email,
            oi.address,
            oi.phone_number
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC;
        -- params: [userId]
    `,

    getOrderItemsByOrderIdQuery: `
        SELECT 
            oti.quantity,
            pm.name AS pizza_name,
            pm.unit_price,
            pm.img_url
        FROM order_items oti
        JOIN pizza_menu pm ON oti.pizza_id = pm.pizza_id
        WHERE oti.order_id = ?;
        -- params: [orderId]
    `,

    getOrderByIdQuery: `
        SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            oi.name,
            oi.email,
            oi.address,
            oi.phone_number
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        WHERE o.order_id = ? AND o.user_id = ?;
        -- params: [orderId, userId]
    `,

    checkOrderBelongsToUserQuery: `
        SELECT order_id 
        FROM orders 
        WHERE order_id = ? AND user_id = ?;
        -- params: [orderId, userId]
    `,

    updateOrderStatusQuery: `
        UPDATE orders 
        SET status = ? 
        WHERE order_id = ?;
        -- params: [status, orderId]
    `,

    checkOrderStatusQuery: `
        SELECT status 
        FROM orders 
        WHERE order_id = ? AND user_id = ?;
        -- params: [orderId, userId]
    `,

    cancelOrderQuery: `
        UPDATE orders 
        SET status = 'cancelled' 
        WHERE order_id = ?;
        -- params: [orderId]
    `,
};

// Admin query
// utils/SQLQueries.js
export const adminQuery = {
    checkAdminCredentialsQuery: `
        SELECT * FROM admin WHERE username = ?; 
        -- params: [username]
    `,

    getAllUsersQuery: `
        SELECT 
            id, 
            username, 
            email, 
            created_at
        FROM users
        ORDER BY id ASC;
        -- params: []
    `,

    getAllPizzasQuery: `
        SELECT 
            pm.pizza_id,
            pm.name AS pizza_name,
            pm.unit_price,
            pm.img_url,
            pm.soldOut_status,
            pm.created_at,
            GROUP_CONCAT(i.name ORDER BY i.name SEPARATOR ', ') AS ingredients
        FROM pizza_menu pm
        LEFT JOIN pizza_ingredients pi ON pm.pizza_id = pi.pizza_id
        LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
        GROUP BY pm.pizza_id
        ORDER BY pm.pizza_id ASC;
        -- params: []
    `,

    addNewPizzaQuery: `
        INSERT INTO pizza_menu (name, unit_price, img_url, soldOut_status)
        VALUES (?, ?, ?, ?);
        -- params: [name, unit_price, img_url, soldOut_status]
    `,

    insertIngredientQuery: `
        INSERT IGNORE INTO ingredients (name) VALUES (?);
        -- params: [ingredient]
    `,

    linkPizzaIngredientQuery: `
        INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
        SELECT ?, ingredient_id FROM ingredients WHERE name = ?;
        -- params: [pizza_id, ingredient]
    `,

    updatePizzaQuery: `
        UPDATE pizza_menu 
        SET name = ?, unit_price = ?, img_url = ?, soldOut_status = ? 
        WHERE pizza_id = ?;
        -- params: [name, unit_price, img_url, soldOut_status, pizza_id]
    `,

    deletePizzaIngredientsQuery: `
        DELETE FROM pizza_ingredients WHERE pizza_id = ?;
        -- params: [pizza_id]
    `,

    insertUpdatedPizzaIngredientQuery: `
        INSERT INTO pizza_ingredients (pizza_id, ingredient_id) 
        VALUES (?, (SELECT ingredient_id FROM ingredients WHERE name = ? LIMIT 1));
        -- params: [pizza_id, ingredient]
    `,

    getAllIngredientsQuery: `
        SELECT ingredient_id, name FROM ingredients ORDER BY name ASC;
        -- params: []
    `,

    markPizzaAsSoldOutQuery: `
        UPDATE pizza_menu SET soldOut_status = ? WHERE pizza_id = ?;
        -- params: [soldOut_status, pizza_id]
    `,

    getUserOrdersQuery: `
        SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            GROUP_CONCAT(
                JSON_OBJECT(
                    'pizza_id', p.pizza_id,
                    'pizza_name', p.name,
                    'quantity', oi.quantity,
                    'unit_price', p.unit_price
                )
                SEPARATOR ','
            ) AS pizzas
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN pizza_menu p ON oi.pizza_id = p.pizza_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
        ORDER BY o.order_date DESC;
        -- params: [user_id]
    `,

    updateOrderStatusQuery: `
        UPDATE orders
        SET status = ?
        WHERE order_id = ?;
        -- params: [status, order_id]
    `,

    getTotalOrdersQuery: `
        SELECT COUNT(*) AS totalOrders FROM orders;
        -- params: []
    `,
};
