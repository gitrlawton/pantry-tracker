import React, { useState } from "react";
import styles from "./RecipeSuggestion.module.css";

function RecipeSuggestion({ pantryItems }) {
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecipeSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/suggestRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pantryItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error fetching recipe suggestion:", error);
      setRecipe("Could not fetch a recipe. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2>Recipe Suggestion:</h2>
        <button onClick={getRecipeSuggestion} disabled={loading}>
          {loading ? "Loading..." : "Generate Recipe"}
        </button>
      </div>
      {recipe && (
        <div>
          <div className={styles.recipeContainer}>
            <pre>{recipe}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSuggestion;