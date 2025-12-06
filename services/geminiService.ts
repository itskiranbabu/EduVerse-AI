
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Lazy Initialization Helper
// We do not initialize the client at the top level to avoid 'process is undefined' errors during build/load.
let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  if (aiClient) return aiClient;

  // Try to find the key in various locations
  let key = '';
  try {
    // @ts-ignore
    key = process.env.API_KEY || import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
  } catch (e) {
    console.warn("Could not read env vars safely");
  }

  if (!key) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey: key });
    return aiClient;
  } catch (e) {
    console.error("Failed to create Gemini Client:", e);
    return null;
  }
};

const MODEL_NAME = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Explains a concept specifically tailored to a student's grade level.
   */
  async explainConcept(concept: string, subject: string, gradeLevel: string = "10th Grade"): Promise<string> {
    const ai = getAiClient();
    if (!ai) return "AI Service is not configured. Please check your API Key.";

    try {
      const prompt = `
        You are an expert ${subject} tutor for a ${gradeLevel} student.
        Explain the concept of "${concept}" clearly and concisely.
        Use an analogy if possible to make it easier to understand.
        Keep the response under 200 words.
        Format with Markdown.
      `;
      
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "I couldn't generate an explanation at this time.";
    } catch (error) {
      console.error("Gemini Explanation Error:", error);
      return "Sorry, I'm having trouble connecting to the knowledge base right now.";
    }
  },

  /**
   * Generates a hint for a homework task without giving the direct answer.
   */
  async getHomeworkHint(taskDescription: string, subject: string): Promise<string> {
    const ai = getAiClient();
    if (!ai) return "AI Service is not configured.";

    try {
      const prompt = `
        The student is working on this ${subject} task: "${taskDescription}".
        Provide a helpful hint or a guiding question to help them solve it themselves.
        DO NOT provide the final answer or write the essay for them.
        Be encouraging.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "Keep trying! Break the problem down into smaller steps.";
    } catch (error) {
      console.error("Gemini Hint Error:", error);
      return "I couldn't generate a hint right now.";
    }
  },

  /**
   * Creates a structured study plan based on pending tasks.
   */
  async generateStudyPlan(tasks: Task[], availableHours: number): Promise<any> {
    const ai = getAiClient();
    if (!ai) return null;

    try {
      const taskList = tasks.map(t => `${t.subject}: ${t.title} (Due: ${t.dueDate.toDateString()})`).join('\n');
      const prompt = `
        I have ${availableHours} hours available for studying today.
        Here are my tasks:
        ${taskList}

        Create a study schedule for me. Prioritize tasks due sooner.
        Break down the time into sessions with breaks.
        Return ONLY valid JSON with this structure:
        {
          "plan": [
            { "time": "00:00 - 00:00", "activity": "Subject - Activity", "type": "study" | "break" }
          ],
          "tip": "A quick study tip"
        }
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["study", "break"] }
                  }
                }
              },
              tip: { type: Type.STRING }
            }
          }
        }
      });
      
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Gemini Planner Error:", error);
      return null;
    }
  },

  /**
   * Generates a career roadmap.
   */
  async generateCareerRoadmap(career: string): Promise<any> {
    const ai = getAiClient();
    if (!ai) return null;

    try {
      const prompt = `
        I am a high school student who wants to become a "${career}".
        Create a roadmap of key milestones I need to achieve, starting from now (High School) to getting the job.
        Include education, skills, and experience steps.
        Return JSON.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["EDUCATION", "SKILL", "EXPERIENCE"] }
                  }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Gemini Career Error:", error);
      return null;
    }
  },

  /**
   * Generates a quick quiz for a subject.
   */
  async generateQuiz(subject: string, topic: string): Promise<any> {
    const ai = getAiClient();
    if (!ai) return null;
    
    try {
      const prompt = `Generate 3 multiple choice questions for ${subject} about ${topic}. Return JSON.`;
       const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswerIndex: { type: Type.INTEGER }
                  }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return null;
    }
  }
};
