import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import { getCountryEmoji } from "../utils/countryUtils";

const REGIONS = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

export default function CountryListPage() {
  const { data: countries = [], isLoading, isError } = useCountriesData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

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

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [countries, searchTerm, selectedRegion]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🌍 Countries</h1>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search countries, examine flags, capitals, population, languages, and geographic info..."
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
                  onClick={() =>
                    navigate(`/country/${country.code.toLowerCase()}`)
                  }
                  tabIndex={0}
                  role="button"
                  title={`${country.name} (${country.code})`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/country/${country.code.toLowerCase()}`);
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
                      <h3 className="country-name" title={country.name}>
                        {country.name}
                      </h3>
                      <span className="country-code-badge">{country.code}</span>
                    </div>
                    {country.capital && country.capital !== "N/A" && (
                      <p
                        className="country-subinfo"
                        title={`Capital: ${country.capital}`}
                      >
                        🏛️ {country.capital}
                      </p>
                    )}
                    <div className="card-footer-row">
                      <span className="region-tag" title={country.region}>
                        {country.region}
                      </span>
                      {country.population > 0 && (
                        <span
                          className="pop-tag"
                          title={`Population: ${country.population.toLocaleString()}`}
                        >
                          👥{" "}
                          {country.population >= 1_000_000
                            ? `${(country.population / 1_000_000).toFixed(1)}M`
                            : country.population >= 1_000
                              ? `${(country.population / 1_000).toFixed(0)}K`
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
    </div>
  );
}
