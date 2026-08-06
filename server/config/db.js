const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codesync"
        );

        console.log("✅ MongoDB Connected");

    } catch (error) {

        console.log("❌ MongoDB Connection Failed");
        console.log(error);

        process.exit(1);
    }
};

module.exports = connectDB;