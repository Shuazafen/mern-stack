import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://olomoshuaomozafen:Alphamajor1@shua.h8ekcem.mongodb.net/food-delivery').then(() => console.log("DB connected"))
}