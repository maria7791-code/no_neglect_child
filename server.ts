import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze-safety", async (req, res) => {
  try {
    const { reports } = req.body;
    
    if (!reports || !Array.isArray(reports)) {
      return res.status(400).json({ error: "Invalid reports data" });
    }

    const reportsText = reports.map(r => `[${r.type}] ${r.description} (위치: ${r.location?.address})`).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음은 서울 회기동에서 발생한 아동 관련 위험 지역 및 방임 의심 사례들에 대한 신고 내용입니다.
      이 내용들을 분석하여 공통적인 위험 패턴 3가지를 도출하고, 각각에 대한 구체적인 지역 사회 행동 지침을 제시해주세요.
      답변은 반드시 한국어로 작성해주세요.
      
      신고 내용:
      ${reportsText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "전체적인 분석 요약" },
            topRisks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "식별된 주요 위험 요소 3가지"
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "권장 사항 및 행동 지침" 
            }
          },
          required: ["summary", "topRisks", "recommendations"]
        }
      }
    });

    const analysis = JSON.parse(response.text);
    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다." });
  }
});

// Vite Middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
