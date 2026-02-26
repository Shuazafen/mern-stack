import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Configure Cloudinary ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Food Model (inline to avoid import issues in script) ---
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});
const FoodModel = mongoose.models.food || mongoose.model('food', foodSchema);

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function migrate() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const foods = await FoodModel.find({});
    console.log(`Found ${foods.length} food items in DB.\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const food of foods) {
        const imageField = food.image;

        // Already a Cloudinary URL — skip
        if (imageField.startsWith('http')) {
            console.log(`⏭  Skipping "${food.name}" — already has URL: ${imageField}`);
            skipped++;
            continue;
        }

        const localPath = path.join(uploadsDir, imageField);

        if (!fs.existsSync(localPath)) {
            console.warn(`⚠️  File not found for "${food.name}": ${localPath}`);
            errors++;
            continue;
        }

        try {
            console.log(`⬆️  Uploading "${food.name}" (${imageField})...`);
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'food-images',
                public_id: path.parse(imageField).name, // use filename without extension
                overwrite: true,
            });

            await FoodModel.findByIdAndUpdate(food._id, { image: result.secure_url });
            console.log(`✅  Updated "${food.name}" → ${result.secure_url}\n`);
            updated++;
        } catch (err) {
            console.error(`❌  Error uploading "${food.name}":`, err.message);
            errors++;
        }
    }

    console.log('\n--- Migration Complete ---');
    console.log(`✅  Updated: ${updated}`);
    console.log(`⏭  Skipped (already URLs): ${skipped}`);
    console.log(`❌  Errors: ${errors}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
}

migrate().catch(console.error);
