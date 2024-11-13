import mongoose from "mongoose";

export const connectDB = async () => {
 await mongoose.connect('mongodb+srv://olomoshuaomozafen:Alphamajor1@shua.h8ekcem.mongodb.net/food-delivery').then(() => console.log("DB connected")) 
}