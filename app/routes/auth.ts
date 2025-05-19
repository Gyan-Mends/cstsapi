import Login from "~/model/login";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    // Handle OPTIONS preflight request
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: corsHeaders,
            status: 204,
        });
    }

    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, { status: 405, headers: corsHeaders });
    }

    const contentType = request.headers.get("Content-Type") || "";

    let payload: any;
    if (contentType.includes("application/json")) {
        payload = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        payload = Object.fromEntries(formData);
    } else {
        return json({ error: "Unsupported Content-Type" }, { status: 415, headers: corsHeaders });
    }

    const { email, password } = payload;

    if (!email || !password) {
        return json(
            {
                error: "Email and password are required",
            },
            { status: 400, headers: corsHeaders }
        );
    }

    const userCheck = await Login.findOne({ email });
    if (!userCheck) {
        return json(
            {
                error: "User not found",
            },
            { status: 401, headers: corsHeaders }
        );
    }

    const isPasswordValid = await bcrypt.compare(password, userCheck.password);
    if (!isPasswordValid) {
        return json(
            {
                error: "Invalid password",
            },
            { status: 401, headers: corsHeaders }
        );
    }

    return json({ success: true, payload, message: "Login successful" }, { status: 200, headers: corsHeaders });
};
