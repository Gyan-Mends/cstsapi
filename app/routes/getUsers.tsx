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
        // Get query parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '7');
        const search_term = url.searchParams.get('search_term') || '';
        const skipCount = (page - 1) * limit;

        // Build search filter
        const searchFilter = search_term
            ? {
                $or: [
                    {
                        fullName: {
                            $regex: new RegExp(
                                search_term
                                    .split(" ")
                                    .map((term) => `(?=.*${term})`)
                                    .join("")
                            ),
                            $options: 'i'
                        },
                    },
                    {
                        email: {
                            $regex: new RegExp(
                                search_term
                                    .split(" ")
                                    .map((term) => `(?=.*${term})`)
                                    .join("")
                            ),
                            $options: 'i'
                        },
                    },
                    {
                        phone: {
                            $regex: new RegExp(
                                search_term
                                    .split(" ")
                                    .map((term) => `(?=.*${term})`)
                                    .join("")
                            ),
                            $options: 'i'
                        },
                    },
                ],
            }
            : {};

        // Get total count and calculate total pages
        const totalUsers = await User.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalUsers / limit);

        // Fetch paginated users
        const users = await User.find(searchFilter)
            .skip(skipCount)
            .limit(limit)
            .sort({ createdAt: -1 });

        const origin = getOrigin(request);
        return json({
            users,
            totalPages,
            currentPage: page,
            totalUsers,
            success: true
        }, {
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
