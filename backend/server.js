import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express()
const port = process.env.PORT || 4000

// Simple CORS - allows all in development
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json())

// Connect to database
connectDB();

// Routes
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Test route
app.get("/", (req, res) => {
    res.json({ 
        message: "API Working Locally!",
        environment: process.env.NODE_ENV || 'development'
    })
})

// ALWAYS listen - removed the condition!
app.listen(port, () => {
    console.log(`✅ Server Started on http://localhost:${port}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Test: http://localhost:${port}/`)
})

export default app;