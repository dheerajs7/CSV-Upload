import mongoose from "mongoose"

const URI = process.env.MONGO_URI

const connectDb = async()=>{
    
    try {
     await mongoose.connect(URI)
     console.log("connected to Mongo DB Atlas");  
     
    }
    catch (error) {
    console.error("database connection failed")
 }
}

export default connectDb;
