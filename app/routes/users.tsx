import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import bcrypt from "bcryptjs";
import User from "~/model/users";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export const loader: LoaderFunction = async ({ request }) => {
    return json({ message: "User API is working" }, { headers: corsHeaders });
};

export const action: ActionFunction = async ({ request }) => {
    try {
        const data = await request.json();
        const { fullName, email, phone, position, password, image } = data;

        // Validate required fields
        if (!fullName || !email || !phone || !position || !password) {
            return json({
                success: false,
                error: "Missing required fields"
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                success: false,
                error: "Invalid email format"
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return json({
                success: false,
                error: "User with this email already exists"
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Save user to the database
        const user = new User({
            fullName,
            email,
            phone,
            position,
            password: hashedPassword,
            image: image || ''
        });

        await user.save();

        return json({
            success: true,
            message: "User saved successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                position: user.position,
                image: user.image
            }
        }, {
            status: 200,
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Error saving user:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Unable to process data'
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
};