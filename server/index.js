const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");

const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");


dotenv.config();

const PORT = process.env.PORT || 4000;
//vercel ke liye ! 
let isConnected = false;
app.use((req,res,next)=>{
    if(!isConnected){
    database.connect();
    }
    next();
})
// database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser()); //Ese As a middleware Use kr rhe hai ! 

app.use(
   cors({
    origin: [
      "https://study-platform-edu-tech-phqc.vercel.app", // frontend URL
      "http://localhost:3000", // for local development
    ],
    credentials: true,
  })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp",
    })
)

cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/reach",contactUsRoute);
app.use("/api/v1/payment", paymentRoutes);



app.get("/",(req,res) =>{
    return res.json({
        success : true,
       message: 'Your server is up and running....'
    })
});

const path = require("path");

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "build"))); 

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(PORT,() =>{
    console.log(`App is running at ${PORT}`);
})

