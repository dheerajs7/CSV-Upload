import mongoose from "mongoose";

const csvFile = new mongoose.Schema({
   name:{
      type: String,
      required: true
    },
    file:{
      type: Array
    }
  },{
    timestamps: true
  });
export const Csv = mongoose.model("Csv",csvFile)