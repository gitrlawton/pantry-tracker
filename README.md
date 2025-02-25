# Pantry Tracker

## Overview

This project is a web application that integrates with Firebase for inventory management, allowing users to keep track of their pantry items. The app also allows users to generate recipe suggestions based on the ingredients they have on hand. Utilizing OpenAI's language model, the application analyzes the provided ingredients and suggests a recipe with detailed steps and quantities.

## Features

- **Inventory Management**: Users can easily add or remove items from their pantry inventory, ensuring they maintain an up-to-date list of their food items.
- **AI-Powered Recipe Generation**: OpenAI API integration to generate personalized recipes based on the user's available ingredients.
- **Intuitive User Interface**: The application features a clean and user-friendly interface.

## Installation

To set up the project, ensure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required packages:

   ```
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory and add your OpenAI and Firebase configuration:

   ```
   NEXT_PUBLIC_RECIPE_SUGGESTION_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_firebase_measurement_id
   ```

## Usage

1. Run the application:

   ```
   npm run dev
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Input the ingredients you have in your pantry. Click on "Generate Recipe" to receive a recipe suggestion.

4. Manage your pantry items by adding or removing them as needed.

## File Descriptions

- **app/api/suggestRecipe/route.js**: The server-side code handling the recipe generation using OpenAI's API.
- **firebase.js**: Configuration file for initializing Firebase and managing Firestore database interactions.
- **app/components/RecipeSuggestion.js**: React component responsible for displaying the recipe suggestion interface and handling user interactions.
- **app/page.js**: The main page of the application, integrating the inventory management and recipe suggestion components.

## Dependencies

- **React**: For building the user interface.
- **Firebase**: For managing the pantry inventory and storing data.
- **OpenAI**: For generating recipe suggestions based on user input.
- **Material-UI**: For UI components and styling.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.
