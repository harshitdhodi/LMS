const mongoose=require("mongoose");

const dbConnect = () => {
    try {
        mongoose.connect(process.env.DATABASE_URI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then( () => {
            console.log("connected to mongoDB")
          })
            
    } catch (error) {
        console.log(error)
    }
}

 
module.exports = dbConnect;
