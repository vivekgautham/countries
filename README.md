# 🌍 Countries Explorer

A modern, high-performance web application to explore comprehensive geographical, demographic, cultural, and aviation data for countries and territories worldwide.

🌐 **Live Demo:** [https://vivekgautham.github.io/countries](https://vivekgautham.github.io/countries)

---

## ✨ Features

- **🔍 Smart Search & Filtering:**
  - Fast instant search matching country names, official titles, capitals, ISO alpha-2/3 codes, and major airport names/IATA codes.
  - Region-based filtering (Africa, Americas, Asia, Europe, Oceania, Antarctic).

- **📊 Comprehensive Country Profiles:**
  - **Demographics & Geography:** Population, land area (sq km & sq mi), capital cities, region, and subregion.
  - **Identities & Codes:** ISO Alpha-2, ISO Alpha-3, international calling codes, official status, and UN membership.
  - **Culture & Economy:** Official currencies (with symbols), spoken languages, and local timezones.
  - **Visuals:** National flags and high-resolution official coats of arms.
  - **Interactive Borders:** Navigate directly to bordering countries with one click.
  - **External Links:** Direct access to Google Maps satellite views and Wikipedia articles.

- **✈️ Aviation & Airport Infrastructure:**
  - Sourced from [OurAirports](https://davidmegginson.github.io/ourairports-data/) open-data.
  - Metrics for active airports, international hubs, regional airfields, heliports, and scheduled commercial routes.
  - Interactive, searchable cards for major airports with 3-letter IATA codes and municipalities.

- **⚡ Fast & Resilient:**
  - Powered by Vite, React 18, and TanStack React Query.
  - Offline-capable with bundled fallback datasets and automated CDN caching.
  - Fully responsive, dark-mode glassmorphic interface built with Material UI (MUI).

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Components & Styling:** [Material UI (MUI v7)](https://mui.com/), [Emotion](https://emotion.sh/)
- **Data Fetching & State:** [TanStack React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), [Lint-Staged](https://github.com/lint-staged/lint-staged), [Commitlint](https://commitlint.js.org/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vivekgautham/countries.git
   cd countries
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server. |
| `npm run build` | Compiles TypeScript and builds optimized production assets into `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality and TypeScript issues. |
| `npm run lint:fix` | Automatically fixes autofixable ESLint issues. |
| `npm run format` | Formats all source files using Prettier. |
| `npm run update:airports` | Downloads and compiles the latest dataset from OurAirports into `src/data/airports.json`. |
| `npm run deploy` | Builds the project and publishes the `dist/` directory to GitHub Pages. |

---

## 📁 Project Structure

```
countries/
├── public/                 # Static public assets
├── scripts/
│   └── update-airports.js  # Script to ingest and aggregate OurAirports CSV data
├── src/
│   ├── api/
│   │   └── countriesApi.ts # Data fetcher with React Query, CDN caching & fallback
│   ├── data/
│   │   ├── airports.json   # Pre-processed airport metrics & major hubs
│   │   └── countries.json  # Bundled country dataset fallback
│   ├── pages/
│   │   ├── CountryDetailPage.tsx # Detailed single country view
│   │   └── CountryListPage.tsx   # Searchable grid view of all countries
│   ├── theme/
│   │   └── theme.ts        # MUI custom dark theme configuration
│   ├── types/
│   │   └── country.ts      # TypeScript interfaces and data models
│   ├── utils/
│   │   └── countryUtils.ts # Helper functions (e.g. flag emojis)
│   ├── App.tsx             # Root component & route definitions
│   └── main.tsx            # Application entrypoint
├── package.json
└── vite.config.ts
```

---

## 📊 Data Sources & Attribution

- **Country Data:** [mledoze/countries](https://github.com/mledoze/countries) (Open Data)
- **Flag Assets:** [FlagCDN](https://flagcdn.com/)
- **Airport & Aviation Data:** [OurAirports](https://davidmegginson.github.io/ourairports-data/) (Public Domain)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
