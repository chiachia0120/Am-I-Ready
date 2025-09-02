import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);
  }

  async generateChecklist(
    payload: any
  ): Promise<{ label: string; icon: string }[]> {
    let prompt = `
You are an assistant that generates a checklist of items to prepare before going out.
The checklist must be practical and based on the user's planned activities and today's weather conditions.
The checklist should be simple, concrete, and designed to reduce memory burden for neurodivergent users.
`;

    if (payload.preferences && Object.keys(payload.preferences).length > 0) {
      prompt += `
User preferences (Yes = usually true, No = usually false):
${JSON.stringify(payload.preferences, null, 2)}
`;
    }

    prompt += `
Plans:
${payload.plans.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

Weather:
- Current temperature: ${payload.weather.temperature_now}°C
- Max temperature today: ${payload.weather.temperature_max}°C
- Min temperature today: ${payload.weather.temperature_min}°C
- Windspeed: ${payload.weather.windspeed} km/h
- Time of day: ${payload.weather.is_day === 1 ? 'Daytime' : 'Nighttime'}
- Condition: ${payload.weather.weather_description}

Please output a checklist of things the user should bring.
The output must be a JSON array of objects, where each object has:
- "label": the item text
- "icon": an Ionicons icon name relevant to the item (example: "school-outline", "water-outline", "sunny-outline", "umbrella-outline").

Example:
[
  { "label": "School bag", "icon": "school-outline" },
  { "label": "Water bottle", "icon": "water-outline" },
  { "label": "Sunscreen", "icon": "sunny-outline" }
]
`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log('prompt', prompt);
    console.log('Raw response:', text);

    try {
      const cleaned = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/,\s*]/g, ']')
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      console.error('JSON parse failed:', err, text);
      return [];
    }
  }
}
