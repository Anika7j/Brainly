import mongoose, { Types } from "mongoose";

mongoose.connect("mongodb+srv://anikajain1307:u8qzPK05it3Lr2Py@cluster1.oeq3xfw.mongodb.net/")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})





const User = mongoose.model("User",userSchema);
export default User;

