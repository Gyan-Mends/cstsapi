import { UsersInterface } from "~/interface";
import mongoose from "~/mongoose.server";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Emails are typically unique for users
    },
    phone: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true, // Corresponds to "role" in the form
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Optionally stores the raw file data as a buffer
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

let User: mongoose.Model<UsersInterface>;

try {
    User = mongoose.model<UsersInterface>("User");
} catch (error) {
    User = mongoose.model<UsersInterface>("User", UserSchema);
}

export default User;
