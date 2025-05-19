
import Login from "~/model/login";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";

const corsHeaders = {
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin"
};

// Function to get the origin from the request
const getOrigin = (request: Request): string => {
    const origin = request.headers.get('Origin');
    if (!origin) return process.env.CORS_ORIGIN || 'http://localhost:3000';
    return origin;
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
        const origin = getOrigin(request);
        return new Response(null, {
            status: 204,
            headers: {
                ...corsHeaders,
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true"
            }
        });
    }

    if (request.method === "POST") {
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

        return json({ success: true, data, message: "Login successful" }, { 
        status: 200, 
        headers: { 
            ...corsHeaders, 
            "Access-Control-Allow-Origin": getOrigin(request)
        } 
    });
    } else {
        return json({ message: "Method not allowed" }, { status: 405, headers: corsHeaders });
    }


};

export const loader = async ({ request }: ActionFunctionArgs) => {
    const origin = getOrigin(request);
    return new Response(null, {
        status: 200,
        headers: {
            ...corsHeaders,
            "Access-Control-Allow-Origin": origin
        }
    });
}
