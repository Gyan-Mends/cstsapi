

import { ContactInterface } from "~/interface";
import mongoose from "~/mongoose.server";

const ContactSchema = new mongoose.Schema({
   name:{
    type:String,
    require:true
   },
   email:{
    type:String,
    require:String
   },
   message:{
    type:String,
    require:true
   }
},{
    timestamps:true
})

let Contact : mongoose.Model<ContactInterface>

try {
  Contact = mongoose.model<ContactInterface>("contact")
} catch (error) {
    Contact= mongoose.model<ContactInterface>("contact",ContactSchema)
}

export default Contact