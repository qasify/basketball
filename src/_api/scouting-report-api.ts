"use server";

import { Player } from "./basketball-api";

export interface ScoutingReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  playerComparison?: string;
}

export type LLMProvider = "openai" | "gemini";

/**
 * Formats player data into a structured prompt for LLM analysis
 */
function formatPlayerDataForPrompt(player: Player): string {
  const basicInfo = [
    `Name: ${player.name}`,
    player.position && `Position: ${player.position}`,
    player.age && `Age: ${player.age}`,
    player.country && `Country: ${player.country}`,
    player.height && `Height: ${player.height}`,
    player.weight && `Weight: ${player.weight}`,
  ]
    .filter(Boolean)
    .join("\n");

  const seasonsData = player.seasons
    ?.map((season) => {
      const stats = [
        `Season: ${season.season}`,
        season.team && `Team: ${season.team}`,
        season.league && `League: ${season.league}`,
        season.gamesPlayed !== undefined && `Games Played: ${season.gamesPlayed}`,
        season.gamesStarted !== undefined && `Games Started: ${season.gamesStarted}`,
        season.minutesPerGame !== undefined && `Minutes/G: ${season.minutesPerGame}`,
        season.pointsPerGame !== undefined && `Points/G: ${season.pointsPerGame}`,
        season.reboundsPerGame !== undefined && `Rebounds/G: ${season.reboundsPerGame}`,
        season.assistsPerGame !== undefined && `Assists/G: ${season.assistsPerGame}`,
        season.stealsPerGame !== undefined && `Steals/G: ${season.stealsPerGame}`,
        season.blocksPerGame !== undefined && `Blocks/G: ${season.blocksPerGame}`,
        season.turnoversPerGame !== undefined && `Turnovers/G: ${season.turnoversPerGame}`,
        season.tsPercent !== undefined && `TS%: ${(season.tsPercent * 100).toFixed(1)}%`,
        season.efgPercent !== undefined && `eFG%: ${(season.efgPercent * 100).toFixed(1)}%`,
        season.offensiveRating !== undefined && `Offensive Rating: ${season.offensiveRating}`,
        season.defensiveRating !== undefined && `Defensive Rating: ${season.defensiveRating}`,
        season.playerEfficiencyRating !== undefined && `PER: ${season.playerEfficiencyRating}`,
      ]
        .filter(Boolean)
        .join(", ");
      return `- ${stats}`;
    })
    .join("\n");

  return `${basicInfo}\n\nCareer Statistics:\n${seasonsData || "No statistics available"}`;
}

/**
 * Creates the prompt for scouting report generation.
 * Report describes who the player is NOW; patterns from past seasons can be mentioned where relevant.
 */
function createScoutingPrompt(playerData: string): string {
  return `You are an expert basketball scout. Write a reliable, factual scouting report. No hype. Describe who the player is NOW based on the data, not who he was in earlier seasons. If relevant, you may mention patterns (e.g. "early in his career he was a poor 3PT shooter; in the last two seasons he has been a solid 40% shooter").

Player Data:
${playerData}

Provide the scouting report in the following JSON format only:
{
  "summary": "2-4 sentence overview of the player as he is now: role, level, main traits.",
  "strengths": ["Offensive strength 1", "Offensive strength 2", "Defensive strength 1", ...],
  "weaknesses": ["Limitation or risk 1 (what could improve)", "What is not likely to change", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "playerComparison": "Optional: brief comparison to a well-known player (only if useful)"
}

Requirements:
- Summary: who the player is now, not historical narrative.
- Strengths: cover both offensive and defensive strengths where data supports it.
- Weaknesses: frame as limitations or risk factors—what could improve and what is unlikely to change. Be direct.
- Recommendations: actionable, based on current profile.
- Use recent seasons as primary evidence; mention earlier patterns only when they add context.
- Be reliable and avoid hype. Return ONLY valid JSON, no other text.`;
}

/**
 * Parses and validates the LLM response
 */
function parseScoutingReport(content: string): ScoutingReport {
  // Extract JSON from response (in case there's extra text)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonContent = jsonMatch ? jsonMatch[0] : content;

  const report: ScoutingReport = JSON.parse(jsonContent);

  // Validate structure
  if (!report.summary || !Array.isArray(report.strengths) || !Array.isArray(report.weaknesses)) {
    throw new Error("Invalid report structure received from LLM");
  }

  return report;
}

/**
 * Generates a scouting report using OpenAI API
 */
export async function generateScoutingReportOpenAI(
  player: Player
): Promise<ScoutingReport> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Please add it to your environment variables."
    );
  }

  const playerData = formatPlayerDataForPrompt(player);
  const prompt = createScoutingPrompt(playerData);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert basketball scout. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    return parseScoutingReport(content);
  } catch (error) {
    console.error("Error generating scouting report with OpenAI:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate scouting report with OpenAI");
  }
}

/**
 * Generates a scouting report using Google Gemini API
 */
export async function generateScoutingReportGemini(
  player: Player
): Promise<ScoutingReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add it to your environment variables."
    );
  }

  const playerData = formatPlayerDataForPrompt(player);
  const prompt = createScoutingPrompt(playerData);

  try {
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert basketball scout. Always respond with valid JSON only.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content received from Gemini API");
    }

    return parseScoutingReport(content);
  } catch (error) {
    console.error("Error generating scouting report with Gemini:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate scouting report with Gemini");
  }
}

/**
 * Generates a scouting report using the specified provider
 */
export async function generateScoutingReport(
  player: Player,
  provider: LLMProvider = "gemini"
): Promise<ScoutingReport> {
  if (provider === "gemini") {
    return generateScoutingReportGemini(player);
  }
  return generateScoutingReportOpenAI(player);
}

/**
 * Prompt for extending/updating a report based on user text (e.g. "Focus on his defense" or "Add comparison with X").
 */
function createExtendReportPrompt(
  existingReportJson: string,
  userPrompt: string,
  playerData: string
): string {
  return `You are an expert basketball scout. A scouting report already exists for this player. The user has asked to add or change something.

User request: "${userPrompt}"

Current report (JSON):
${existingReportJson}

Player data (for reference):
${playerData}

Your task: Produce an updated, complete scouting report in the same JSON format that incorporates the user's request. Keep the same structure: summary, strengths, weaknesses, recommendations, playerComparison (optional). Update or expand the relevant sections based on the user's text. Do not remove existing content unless the user's request implies it. Stay factual and avoid hype. Return ONLY valid JSON, no other text.`;
}

/**
 * Extends/updates a scouting report using the LLM based on user-provided text.
 */
export async function extendScoutingReportWithPrompt(
  player: Player,
  existingReport: ScoutingReport,
  userPrompt: string,
  provider: LLMProvider = "gemini"
): Promise<ScoutingReport> {
  const playerData = formatPlayerDataForPrompt(player);
  const existingReportJson = JSON.stringify(existingReport, null, 2);
  const prompt = createExtendReportPrompt(existingReportJson, userPrompt, playerData);

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are an expert basketball scout. Respond with valid JSON only.\n\n${prompt}` }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 2000 },
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
    }
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("No content from Gemini");
    return parseScoutingReport(content);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert basketball scout. Respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error: ${response.status}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from OpenAI");
  return parseScoutingReport(content);
}
