const { Router } = require("express");
const { courseModel } = require('../db');
const courseRouter = Router();


courseRouter.get('/courses', async (req, res) => {
    try {
        const courses = await courseModel.find({});
        return res.status(200).json({ courses });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching courses!",
            error: err.message,
        });
    }
});


courseRouter.get('/courses/:courseId', async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const course = await courseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course Not Found!" });
        }

        return res.status(200).json({ course });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching the course!",
            error: error.message,
        });
    }
});

module.exports = {
    courseRouter,
};
