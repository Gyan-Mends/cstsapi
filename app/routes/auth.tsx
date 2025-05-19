// import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
// import bcrypt from "bcryptjs";
import Login from "~/model/login";
// import { commitSession, getSession } from "~/session";

// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type"
// };

// export const action: ActionFunction = async ({ request }) => {
//     try {
//         const contentType = request.headers.get('Content-Type') || '';
//         let data;

//         // Handle both JSON and URL-encoded form data
//         if (contentType.includes('application/json')) {
//             data = await request.json();
//         } else {
//             const formData = await request.formData();
//             data = {
//                 email: formData.get('email'),
//                 password: formData.get('password')
//             };
//         }

//     } catch (error) {
//         console.error('Login error:', error);
//         return json({
//             error: "An error occurred during login"
//         }, { status: 500 });
//     }


// }

// export const loader: LoaderFunction = async ({ request }) => {
//     return json({ message: "OK" }, { headers: corsHeaders })
// }


import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import bcrypt from "bcryptjs";

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }
    const payload = await request.json();

    console.log(payload);

    const { email, password } = payload;
    if (!email || !password) {
        return json({
            error: "Email and password are required"
        }, { status: 400 });
    }

    const userCheck = await Login.findOne({ email });
    if (!userCheck) {
        return json({
            error: "User not found"
        }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, userCheck.password);
    if (!isPasswordValid) {
        return json({
            error: "Invalid password"
        }, { status: 401 });
    }

    // Create session
    // const session = await getSession(request.headers.get("Cookie"));
    // session.set("email", userCheck.email);
    // return json({
    //     success: true,
    //    
    //     redirect: "/"
    // }, {
    //     headers: {
    //         ...corsHeaders,
    //         'Set-Cookie': await commitSession(session)
    //     }
    // });
    return json({ success: true, payload ,message:"Login successful"}, 200);
};
