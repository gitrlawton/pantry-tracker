import { OpenAI } from "openai";

export async function POST(request) {
  try {
    // Parse JSON from the request
    const { pantryItems } = await request.json();

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_RECIPE_SUGGESTION_OPENAI_API_KEY,
    });



    // Generate a recipe using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Suggest a recipe using the following ingredients: ${pantryItems.join(", ")}. Please provide a recipe with steps and quantities.`,
        },
      ],
      temperature: 0.7,
    });

    // Extract and return the recipe
    const recipe = response.choices[0].message.content.trim();
    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe from OpenAI:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recipe" }), { status: 500 });
  }
}