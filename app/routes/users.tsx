import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import User from "~/model/users";
// Assuming `user` model file is located in `model` directory

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
        const { fullName, email, phone, position, password, base64Image } = data;

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

        // Save user to the database
        const userResponse = new User({
            fullName,
            email,
            phone,
            position,
            password,
            base64Image
        });

        await userResponse.save();

        return json({
            success: true,
            message: "User saved successfully"
        }, {
            status: 200,
            headers: corsHeaders
        });
    } catch (error) {
        return json({
            success: false,
            error: "Unable to process data"
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
};
