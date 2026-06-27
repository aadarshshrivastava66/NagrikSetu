const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const { initGridFS } = require("./config/gridfs");

dotenv.config();
const app=express();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connect to Database");
    initGridFS();
})
.catch((err)=>{
    console.log(err);
})
console.log(process.env.CLIENT_URL)
app.use(cors({
    
    origin:process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

const AuthRoute=require('./router/authRoutes')
app.use('/api/auth',AuthRoute);

const issueRoute=require('./router/issueRoutes')
app.use('/api/issues',issueRoute);

const fileRoute=require('./router/fileRoutes')
app.use('/api/files',fileRoute);


app.listen(5000,()=>{
    console.log("app in on Port 5000");
})