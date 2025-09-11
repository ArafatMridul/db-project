import express from "express";
import menuRoutes from "./routes/menu.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/cart.js";
import cartRoutes from "./routes/cart.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/menu", menuRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.listen(8800, () => {
    console.log("Connected");
});
