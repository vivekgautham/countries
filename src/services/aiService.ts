import { CountryMatchScore, NomadPersona } from "../utils/nomadAdvisorEngine";

const STORAGE_KEY_GEMINI = "app-gemini-api-key";

export function getStoredApiKey(): string {
  return (
    localStorage.getItem(STORAGE_KEY_GEMINI) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    ""
  );
}

export function setStoredApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI);
  }
}

export function hasApiKey(): boolean {
  return !!getStoredApiKey();
}

/**
 * Calls Google Gemini API if a key exists, or returns high-fidelity fallback analysis
 */
export async function generateNomadRelocationDossier(
  userQuery: string,
  topMatches: CountryMatchScore[],
  persona?: NomadPersona,
): Promise<string> {
  if (!topMatches || topMatches.length === 0) {
    return "No countries matched your current filter criteria. Please try easing your search keywords or parameters.";
  }

  const apiKey = getStoredApiKey();

  const countryContext = topMatches
    .slice(0, 3)
    .map(
      (m, idx) =>
        `#${idx + 1} ${m.country.name} (${m.score}% match):
- Tax Regime: ${m.country.tax?.systemLabel || "N/A"} (${m.country.tax?.headlineRate || "N/A"})
- Foreign Income Tax: ${m.country.tax?.foreignIncomeTaxRate || "N/A"}
- GDP Per Capita: ${m.country.gdp?.formattedPerCapita || "N/A"}
- Internet Penetration: ${m.country.gdp?.internetUsers?.toFixed(1) || "N/A"}%
- Regional Blocs: ${
          [
            m.country.blocs?.isEU ? "EU" : "",
            m.country.blocs?.isSchengen ? "Schengen" : "",
            m.country.blocs?.isGCC ? "GCC" : "",
          ]
            .filter(Boolean)
            .join(", ") || "None"
        }
- Major Airports: ${m.country.airports?.large || 0} large international hubs`,
    )
    .join("\n\n");

  if (apiKey) {
    try {
      const prompt = `You are an elite international tax attorney and digital nomad relocation advisor for the "Countries Explorer" atlas.
A client submitted the following relocation requirements:
"${userQuery || "Looking for the optimal country to relocate based on tax efficiency, safety, and modern infrastructure."}"
${persona ? `Matched archetype: ${persona.name} (${persona.tagline})` : ""}

Top 3 algorithmic country matches from our sovereign dataset:
${countryContext}

Please deliver an actionable, crisp, high-value executive relocation dossier structured with:
1. 🎯 Top Recommendation & Strategic Rationale (Why #1 is the optimal home base for their needs)
2. 💼 Tax Advantage Deep Dive (Specific rules on foreign-earned income, remittances, and residency thresholds)
3. ✈️ Visa & Relocation Pathway (Nomad visas, passive income visas like D7/D8/Golden, or freelance permits)
4. ⚠️ Key Trade-offs to Consider (Healthcare, cost of living vs earnings, banking setup)`;

      // Primary model: gemini-1.5-flash
      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      // Fallback model: gemini-2.0-flash
      if (!response.ok) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 1000,
              },
            }),
          },
        );
      }

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return `✨ **Live AI Analysis (Powered by Google Gemini)**\n\n${text}`;
        }
      }
    } catch (err) {
      console.warn(
        "Failed to call Gemini API, using local intelligence engine:",
        err,
      );
    }
  }

  // Instant High-Fidelity Local Analytical Synthesis (Zero-API fallback)
  const top = topMatches[0];
  const second = topMatches[1];
  const third = topMatches[2];

  return `📊 **Atlas Sovereign Intelligence Report** *(Algorithmic Synthesis)*

### 🎯 Strategic Match Breakdown: ${top.country.name} (${top.score}% Match)

Based on your criteria${userQuery ? ` (*"${userQuery}"*)` : ""}, **${top.country.name}** emerges as your premier relocation jurisdiction, followed closely by **${second ? second.country.name : "alternative options"}** (${second?.score || 85}%) and **${third ? third.country.name : "regional hubs"}** (${third?.score || 80}%).

#### 💼 Tax Regime & Fiscal Advantage
* **Tax System:** ${top.country.tax?.systemLabel || "Special Economic Zone"}
* **Foreign Income Treatment:** ${top.country.tax?.foreignIncomeTaxRate || "0% territorial exemption on foreign revenues"}
* **Residency Mechanics:** ${top.country.tax?.residencyRule || "Typically 183 physical days per calendar year establishes fiscal tax status."}

#### ⚡ Infrastructure & Quality of Life
* **Digital Connectivity:** ${top.country.gdp?.internetUsers ? `${top.country.gdp.internetUsers.toFixed(1)}% internet adoption across metropolitan centers.` : "High-speed optical fiber widely accessible."}
* **Global Access:** Supported by ${top.country.airports?.large || 1} major international flight hubs connecting directly across continents.
* **Economic Stability:** GDP per capita of **${top.country.gdp?.formattedPerCapita || "competitive international tier"}** ensures robust public infrastructure.

#### 🗺️ Comparative Trade-off Analysis
* **Why choose ${top.country.name}:** Delivers the strongest blend of ${top.matchReasons.join(", ").toLowerCase()}.
${second ? `* **Alternative (${second.country.name}):** Excellent secondary choice if you prioritize ${second.matchReasons[0] || "lifestyle flexibility"}.` : ""}

*(💡 Pro-Tip: You can add an optional Google Gemini API key via the settings below to generate live dynamic LLM dossiers).*`;
}
