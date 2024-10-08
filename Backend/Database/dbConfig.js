const dbPassword = "i7EkeCS17ZGVqMDL";
const dbUserName = "mahmudulislam0999";
const mongoose = require("mongoose");
const connectionUrl =
    "mongodb+srv://mahmudulislam0999:i7EkeCS17ZGVqMDL@cluster0.ahhmd.mongodb.net/blog";

const connectDB = async () => {
    try {
        const mongoDbInstance = await mongoose.connect(connectionUrl);
        console.log(`mongodb connection is successful ${mongoDbInstance.connection.host}`);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { connectDB };
