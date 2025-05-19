import { LoginInterface } from "~/interface"
import mongoose from "~/mongoose.server"

const LoginSchema = new mongoose.Schema({
   email:{
    type:String,
    require:true
   },
   password:{
    type:String,
    require:true
   } 
},{
    timestamps:true
})

let Login : mongoose.Model<LoginInterface>

try {
    Login = mongoose.model<LoginInterface>("login")
} catch (error) {
    Login = mongoose.model<LoginInterface>("login",LoginSchema)
}

export default Login
