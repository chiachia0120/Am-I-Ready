# Am I Ready?

This application is built with **Ionic and Angular**. 
This project is designed to support neurodivergent users by helping them quickly generate a personalised checklist of items to pack before going out.

### Pages

- **`plan.page.html` / `plan.page.ts`**  
  Planning page. Users can add, remove, and select plans for the day.  
  Selecting “Generate Checklist” combines these plans with user preferences and weather data to create a checklist.  

- **`checklist.page.html` / `checklist.page.ts`**  
  Checklist page. Displays the generated list of items.  
  Users can tick items off, add their own items, or edit and delete existing ones.  
  Includes weather information and a progress indicator.  

- **`question.page.html` / `question.page.ts`**  
  User preferences page. Guides users through questions to store personal preferences.  
  These preferences are later used to influence checklist generation.  

### Services

- **`plan.service.ts`**  
  Manages application state, including daily activities and the generated checklist.  
  Supports adding, toggling, removing, and restoring items.  
  Persists data through `StorageService`.  

- **`gemini.service.ts`**  
  Connects to Google Generative AI (Gemini) to generate a checklist.  
  Builds a structured prompt using user plans, weather data, and preferences.  
  Ensures the AI response is parsed into a usable checklist format.  

- **`weather.service.ts`**  
  Retrieves the user’s current location (default London if not available).  
  Uses reverse geocoding to get the city name.  
  Fetches weather information from the Open-Meteo API.  

- **`user-preferences.service.ts`**  
  Stores and retrieves user preferences in local storage.  

- **`storage.service.ts`**  
  Wrapper for Capacitor Preferences to persist data such as plans and checklists.  

## Workflow

1. **User sets preferences** through the Question page.  
2. **User creates daily plans** on the Plan page.  
3. **Weather data is retrieved** automatically based on the user’s location.  
4. **Checklist is generated** by the Gemini AI service, combining all inputs.  
5. **User reviews the checklist** on the Checklist page, with options to modify and complete items.  

## Technologies

- **Frontend**: Angular, Ionic Framework  
- **AI**: Google Generative AI (Gemini)  
- **APIs**: Open-Meteo (weather)
- **Storage**: Capacitor Preferences, Local Storage  
- **UI components**: Ionic cards, lists, checkboxes, progress bars, inputs, and buttons  
