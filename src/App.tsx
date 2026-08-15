import { useMemo, useState } from "react";
import { useCountriesData } from "./api/countriesApi";
import "./App.css";
import { UnifiedCountry } from "./types/country";

export function getCountryEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

type SortOption = "name-asc" | "pop-desc" | "area-desc";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

function App() {
  const { data: countries = [], isLoading, isError } = useCountriesData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [selectedCountry, setSelectedCountry] = useState<UnifiedCountry | null>(
    null,
  );

  // Map of 3-letter ISO code -> Country name for border country links
  const code3ToCountryMap = useMemo(() => {
    const map = new Map<string, UnifiedCountry>();
    countries.forEach((c) => {
      if (c.code3) {
        map.set(c.code3, c);
      }
    });
    return map;
  }, [countries]);

  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // Filter by Region
    if (selectedRegion !== "All") {
      result = result.filter(
        (c) => c.region.toLowerCase() === selectedRegion.toLowerCase(),
      );
    }

    // Filter by Search Query
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.officialName && c.officialName.toLowerCase().includes(query)) ||
          c.code.toLowerCase().includes(query) ||
          (c.code3 && c.code3.toLowerCase().includes(query)) ||
          (c.capital && c.capital.toLowerCase().includes(query)),
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "pop-desc") {
        return b.population - a.population;
      }
      if (sortBy === "area-desc") {
        return (b.area || 0) - (a.area || 0);
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [countries, searchTerm, selectedRegion, sortBy]);

  const totalFilteredPopulation = useMemo(() => {
    return filteredCountries.reduce((sum, c) => sum + (c.population || 0), 0);
  }, [filteredCountries]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🌐 Countries Explorer</h1>
          <p className="subtitle">
            Search countries, examine flags, capitals, population, languages,
            and geographic info
          </p>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, capital, or ISO code (e.g. Japan, Tokyo, JP, CAN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchTerm && (
              <button
                className="clear-button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-sort-row">
            {/* Region Filter Chips */}
            <div className="region-chips">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  className={`chip ${selectedRegion === region ? "active" : ""}`}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="sort-wrapper">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="name-asc">Name (A–Z)</option>
                <option value="pop-desc">Population (Highest)</option>
                <option value="area-desc">Area (Largest)</option>
              </select>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <span>
              <strong>{filteredCountries.length}</strong>{" "}
              {filteredCountries.length === 1 ? "country" : "countries"}
            </span>
            {totalFilteredPopulation > 0 && (
              <span>
                Total Population:{" "}
                <strong>{totalFilteredPopulation.toLocaleString()}</strong>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="main-content">
        {isLoading && countries.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading country details...</p>
          </div>
        ) : isError && countries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h2>Unable to load country details</h2>
            <p>Please check your network connection and try again.</p>
          </div>
        ) : filteredCountries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏳️</div>
            <h2>No matching countries found</h2>
            <p>Try adjusting your search criteria or region filter.</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="country-grid">
            {filteredCountries.map((country) => {
              const codeLower = country.code.toLowerCase();
              const flagUrl = `https://flagcdn.com/w320/${codeLower}.png`;

              return (
                <div
                  key={country.code}
                  className="country-card"
                  onClick={() => setSelectedCountry(country)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedCountry(country);
                    }
                  }}
                >
                  <div className="flag-wrapper">
                    <img
                      src={flagUrl}
                      alt={`Flag of ${country.name}`}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="emoji-flag-fallback">
                      {getCountryEmoji(country.code)}
                    </span>
                  </div>
                  <div className="country-info">
                    <div className="card-header-row">
                      <h3 className="country-name">{country.name}</h3>
                      <span className="country-code-badge">{country.code}</span>
                    </div>
                    {country.capital && country.capital !== "N/A" && (
                      <p className="country-subinfo">🏛️ {country.capital}</p>
                    )}
                    <div className="card-footer-row">
                      <span className="region-tag">{country.region}</span>
                      {country.population > 0 && (
                        <span className="pop-tag">
                          👥{" "}
                          {country.population >= 1_000_000
                            ? `${(country.population / 1_000_000).toFixed(1)}M`
                            : country.population.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedCountry && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCountry(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedCountry(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="modal-header-banner">
              <div className="modal-flag-box">
                <img
                  src={`https://flagcdn.com/w640/${selectedCountry.code.toLowerCase()}.png`}
                  alt={`Flag of ${selectedCountry.name}`}
                  className="modal-flag-img"
                />
              </div>
              {selectedCountry.coatOfArms && (
                <div className="coat-of-arms-box" title="Coat of Arms">
                  <img
                    src={selectedCountry.coatOfArms}
                    alt={`Coat of Arms of ${selectedCountry.name}`}
                  />
                </div>
              )}
            </div>

            <div className="modal-body">
              <div className="modal-title-row">
                <h2>
                  {getCountryEmoji(selectedCountry.code)} {selectedCountry.name}
                </h2>
                {selectedCountry.unMember && (
                  <span
                    className="un-badge"
                    title="United Nations Member State"
                  >
                    🇺🇳 UN Member
                  </span>
                )}
              </div>

              {selectedCountry.officialName &&
                selectedCountry.officialName !== selectedCountry.name && (
                  <p className="official-name">
                    {selectedCountry.officialName}
                  </p>
                )}

              <div className="info-grid">
                <div className="info-card">
                  <span className="info-label">🏛️ Capital</span>
                  <span className="info-value">
                    {selectedCountry.capital || "N/A"}
                  </span>
                </div>

                <div className="info-card">
                  <span className="info-label">📍 Region / Subregion</span>
                  <span className="info-value">
                    {selectedCountry.region}
                    {selectedCountry.subregion
                      ? ` • ${selectedCountry.subregion}`
                      : ""}
                  </span>
                </div>

                <div className="info-card">
                  <span className="info-label">👥 Population</span>
                  <span className="info-value">
                    {selectedCountry.population
                      ? selectedCountry.population.toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                <div className="info-card">
                  <span className="info-label">📐 Area</span>
                  <span className="info-value">
                    {selectedCountry.area
                      ? `${selectedCountry.area.toLocaleString()} sq km`
                      : "N/A"}
                  </span>
                </div>

                <div className="info-card">
                  <span className="info-label">🔤 ISO Codes</span>
                  <span className="info-value">
                    {selectedCountry.code}{" "}
                    {selectedCountry.code3 ? `/ ${selectedCountry.code3}` : ""}
                  </span>
                </div>

                {selectedCountry.phoneCode && (
                  <div className="info-card">
                    <span className="info-label">📞 Calling Code</span>
                    <span className="info-value">
                      {selectedCountry.phoneCode}
                    </span>
                  </div>
                )}

                {selectedCountry.currencies &&
                  selectedCountry.currencies.length > 0 && (
                    <div className="info-card full-width">
                      <span className="info-label">💵 Currencies</span>
                      <span className="info-value">
                        {selectedCountry.currencies.join(", ")}
                      </span>
                    </div>
                  )}

                {selectedCountry.languages &&
                  selectedCountry.languages.length > 0 && (
                    <div className="info-card full-width">
                      <span className="info-label">🗣️ Languages</span>
                      <span className="info-value">
                        {selectedCountry.languages.join(", ")}
                      </span>
                    </div>
                  )}

                {selectedCountry.timezones &&
                  selectedCountry.timezones.length > 0 && (
                    <div className="info-card full-width">
                      <span className="info-label">⏰ Timezones</span>
                      <span className="info-value">
                        {selectedCountry.timezones.slice(0, 5).join(", ")}
                      </span>
                    </div>
                  )}

                {/* Border Countries */}
                {selectedCountry.borders &&
                  selectedCountry.borders.length > 0 && (
                    <div className="info-card full-width">
                      <span className="info-label">🗺️ Border Countries</span>
                      <div className="border-chips">
                        {selectedCountry.borders.map((bCode) => {
                          const neighbor = code3ToCountryMap.get(bCode);
                          return (
                            <button
                              key={bCode}
                              className="border-chip"
                              onClick={() => {
                                if (neighbor) {
                                  setSelectedCountry(neighbor);
                                }
                              }}
                            >
                              {neighbor
                                ? `${getCountryEmoji(neighbor.code)} ${neighbor.name}`
                                : bCode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>

              <div className="modal-actions">
                <a
                  href={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                  target="_blank"
                  rel="noreferrer"
                  className="download-flag-link"
                >
                  Download High-Res SVG Flag ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
