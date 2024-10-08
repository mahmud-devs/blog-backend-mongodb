const express = require("express");
const { connectDB } = require("./Database/dbConfig.js");
const blogModel = require("./Model/blog.model.js");
const cors = require("cors");
const app = express();
// ===== connect database
connectDB();
// ========== middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ============ make routes and creating data

app.post("/blogPage", async (req, res) => {
    try {
        const { title, description, author } = req.body;
        if (!title) {
            return res.status(404).json({
                success: false,
                data: null,
                messege: "title is missing !!",
                error: true,
            });
        }
        if (!description) {
            return res.status(404).json({
                success: false,
                data: null,
                messege: "description is missing !!",
                error: true,
            });
        }
        if (!author) {
            return res.status(404).json({
                success: false,
                data: null,
                messege: "author name is missing !!",
                error: true,
            });
        }

        // ======= check if the title is alredy in use

        const existingData = await blogModel.find({ title: title });
        if (existingData?.length) {
            return res.status(404).json({
                success: false,
                data: null,
                messege: `the title "${title}" is already in use !!`,
                error: true,
            });
        }

        // ============= saving data in mongodb
        const saveData = await new blogModel({
            title: title,
            description: description,
            author: author,
        }).save();
        if (saveData) {
            return res.status(200).json({
                success: true,
                data: saveData,
                messege: "data saved successfully",
                error: false,
            });
        }
    } catch (error) {
        console.log("error from blogpage route ");
    }
});

//  ========== retrive all blog data ===============

app.get("/allBlogData", async (req, res) => {
    try {
        const allBlogData = await blogModel.find({});
        if (allBlogData) {
            res.status(200).json({
                error: false,
                data: allBlogData,
                messege: "retrive all data successfully",
                success: true,
            });
        }
    } catch (error) {
        console.log("reeor from all blog data", error);
    }
});

// ========== updating blog data =========

app.patch("/updateData/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, author } = req.body;

        const updateBlogData = await blogModel.findOneAndUpdate(
            { _id: id },
            {
                ...(title && { title: title }),
                ...(description && { description: description }),
                ...(author && { author: author }),
            },
            { new: true }
        );
        if (updateBlogData) {
            res.status(200).json({
                success: true,
                error: false,
                messege: "blog data updated successfully",
                data: updateBlogData,
            });
        }
    } catch (error) {
        console.log("reeor from update blog data", error);
    }
});

// ========= delete data from blog database ============
app.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteItem = await blogModel.findOneAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            error: false,
            messege: "item deleted successfully",
            data: deleteItem,
        });
    } catch (error) {
        console.log("error from delete data", error);
    }
});

app.listen(4000, () => {
    console.log("console running on port 4000");
});
