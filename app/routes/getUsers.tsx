import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import User from "~/model/users";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

const getOrigin = (request: Request): string => {
    const origin = request.headers.get('Origin');
    if (!origin) return process.env.CORS_ORIGIN || 'http://localhost:3000';
    return origin;
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const users = await User.find();
        const origin = getOrigin(request);
        return json(users, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': origin,
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Unable to fetch users'
        }, {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': getOrigin(request),
            }
        });
    }
}
