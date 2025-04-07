const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL=process.env.MONGO_URL

const {userRouter} = require("./routes/users")
const {adminRouter} = require("./routes/admin")
const {courseRouter} = require("./routes/course")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user/",userRouter);
app.use("api/v1/admin/",adminRouter);
app.use("/api/v1/course/",courseRouter);


async function main(){
    await mongoose.connect(MONGO_URL)
    console.log("Connected to the Database")
}

main()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
