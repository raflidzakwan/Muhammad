import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, ForecastResult, InsightResult, FinancialTransaction, InvoiceData } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = "gemini-2.5-flash";

/**
 * Predicts inventory needs based on current stock and usage patterns.
 * Demonstrates: AI for Supply Chain Management.
 */
export const predictInventoryNeeds = async (inventory: InventoryItem[]): Promise<ForecastResult[]> => {
  const prompt = `
    Analyze the following hospital inventory data. 
    Based on the 'currentStock', 'reorderLevel', and 'lastUsageRate', 
    predict the demand for the next month and recommend order quantities.
    Consider a safety stock buffer of 20%.
    
    Inventory Data: ${JSON.stringify(inventory)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemId: { type: Type.STRING },
              itemName: { type: Type.STRING },
              predictedDemand: { type: Type.NUMBER },
              recommendedOrder: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ["itemId", "itemName", "predictedDemand", "recommendedOrder", "reasoning"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ForecastResult[];
    }
    return [];
  } catch (error) {
    console.error("Error predicting inventory:", error);
    return [];
  }
};

/**
 * Analyzes financial data to provide strategic insights.
 * Demonstrates: AI for Business Intelligence & Decision Support.
 */
export const generateFinancialInsights = async (transactions: FinancialTransaction[]): Promise<InsightResult[]> => {
  // Summarize data to avoid token limits if list is huge (simplified for demo)
  const summary = transactions.slice(0, 50); 
  
  const prompt = `
    You are a Chief Financial Officer AI assistant. Analyze these recent financial transactions.
    Identify anomalies, cost-saving opportunities, or revenue trends.
    Provide 3 concise, high-impact strategic insights.
    
    Transactions: ${JSON.stringify(summary)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              insight: { type: Type.STRING },
              actionable: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InsightResult[];
    }
    return [];
  } catch (error) {
    console.error("Error analyzing financials:", error);
    return [];
  }
};

/**
 * Extracts structured data from unstructured invoice text.
 * Demonstrates: AI-Powered Accounting Automation (AP).
 */
export const parseInvoiceText = async (invoiceText: string): Promise<InvoiceData | null> => {
  const prompt = `
    Extract valid invoice data from the following unstructured text.
    If data is missing, estimate confidence as low.
    
    Invoice Text: "${invoiceText}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            invoiceDate: { type: Type.STRING },
            totalAmount: { type: Type.NUMBER },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER }
                }
              }
            },
            confidence: { type: Type.NUMBER, description: "0 to 1 confidence score" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InvoiceData;
    }
    return null;
  } catch (error) {
    console.error("Error parsing invoice:", error);
    return null;
  }
};