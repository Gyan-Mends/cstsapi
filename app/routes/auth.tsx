
import Login from "~/model/login";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";

const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin"
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                ...corsHeaders,
                "Vary": "Origin"
            }
        });
    }

    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, { status: 405, headers: corsHeaders });
    }
    const data = await request.json();


    const { email, password } = data;
    if (!email || !password) {
        return json({
            error: "Email and password are required"
        }, { status: 400, headers: corsHeaders });
    }

    const userCheck = await Login.findOne({ email });
    if (!userCheck) {
        return json({
            error: "User not found"
        }, { status: 401, headers: corsHeaders });
    }

    const isPasswordValid = await bcrypt.compare(password, userCheck.password);
    if (!isPasswordValid) {
        return json({
            error: "Invalid password"
        }, { status: 401, headers: corsHeaders });
    }


    return json({ success: true, data, message: "Login successful" }, { status: 200, headers: corsHeaders });
};
