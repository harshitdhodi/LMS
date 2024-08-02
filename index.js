const express = require('express');
const dbConnect = require("./config/db")
const bodyParser = require("body-parser")
const user = require("./route/user");
const lead = require("./route/leads")
const manager = require("./route/manager")
const leadType = require("./route/leadsType")
const statusType = require("./route/status");
const leadSource = require("./route/leadSource")
const count = require("./route/count")
const cors = require("cors")
const cookieParser = require("cookie-parser");
// const { notFound, errorHandler } = require('./middleware/errorHandler');
const app = express();
require("dotenv").config();
const PORT= process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your front-end origin
  credentials: true // This allows cookies to be sent along with requests
}));
// MongoDB connection
dbConnect(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use("/api/user" , user)
app.use("/api/lead" , lead)
app.use("/api/manager" , manager)
app.use("/api/leadType" , leadType)
app.use("/api/statusType" , statusType)
app.use("/api/leadSource" , leadSource)
app.use("/api/count" , count)
  
  // Use error handler
//   app.use(errorHandler);
// app.use("/",(req , res) => {
//     res.send("Hello Server ")
// } )
app.listen(PORT , () => {
    console.log(`Server Running at PORT ${PORT} `)
})
