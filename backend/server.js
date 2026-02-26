import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express()
const port = process.env.PORT || 4000  // Use Vercel's PORT or fallback to 4000

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'], // Add your frontend URL
    credentials: true
}))

// Connect to database (this will run on serverless functions)
connectDB();

// Routes
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Health check route
app.get("/", (req, res) => {
    res.json({ 
        message: "API Working",
        environment: process.env.NODE_ENV || 'development'
    })
})

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`)
    })
}

export default app;