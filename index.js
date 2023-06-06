require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser())
app.use(express.json())

// import routes for TODO api 
const authRoutes = require('./routes/auth')

// mount todo api routes 
app.use('/api/v1/', authRoutes)


app.listen(PORT,()=>{
    console.log(`server started successfully on port ${PORT}`);
})


const dbConnect = require('./config/database')
dbConnect();

app.get('/', (req, res)=>{
    res.send('<h1>HOMEPAGE</h1>')
})

