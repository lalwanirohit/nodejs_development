import mongoose from "mongoose";

// Default Schema
const userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    phone: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    tc: {type: Boolean, required: true, trim: true},
})

// Model
const userModel = mongoose.model("users", userSchema);

export default userModel;