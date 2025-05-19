import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import Contact from "~/model/contact";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export const loader: LoaderFunction = async ({ request }) => {
  return json({ message: "OK" }, { headers: corsHeaders });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const data = await request.json()
    const { name, email, message } = data

    const contactResponse = new Contact({
      name,
      email,
      message
    })

    await contactResponse.save()

    return json({
      success: true,
      message: "Contact saved successfully"
    }, {
      status: 200,
      headers: corsHeaders
    })
  } catch (error) {
    return json({
      success: false,
      error: "Unable to process data"
    }, {
      status: 500,
      headers: corsHeaders
    })
  }
}
