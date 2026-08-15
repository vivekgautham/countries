import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import { UnifiedCountry } from "../types/country";
import { getCountryEmoji } from "../utils/countryUtils";

export default function CountryDetailPage() {
  const { countryCode = "" } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const { data: countries = [], isLoading } = useCountriesData();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [countryCode]);

  // Map of 3-letter ISO code -> Country for border links
  const code3ToCountryMap = useMemo(() => {
    const map = new Map<string, UnifiedCountry>();
    countries.forEach((c) => {
      if (c.code3) {
        map.set(c.code3.toUpperCase(), c);
      }
    });
    return map;
  }, [countries]);

  const country = useMemo(() => {
    const target = countryCode.trim().toUpperCase();
    if (!target) return null;
    return (
      countries.find(
        (c) =>
          c.code.toUpperCase() === target ||
          (c.code3 && c.code3.toUpperCase() === target),
      ) || null
    );
  }, [countries, countryCode]);

  if (isLoading && countries.length === 0) {
    return (
      <div className="app-container">
        <div className="detail-page-wrapper">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading country details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="app-container">
        <div className="detail-page-wrapper">
          <div className="detail-nav-bar">
            <Link to="/" className="back-button">
              ← Back to all countries
            </Link>
          </div>
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h2>Country Not Found</h2>
            <p>
              We couldn&apos;t find a country matching &ldquo;{countryCode}
              &rdquo;.
            </p>
            <button className="reset-btn" onClick={() => navigate("/")}>
              Explore Countries
            </button>
          </div>
        </div>
      </div>
    );
  }

  const codeLower = country.code.toLowerCase();
  const flagUrl = `https://flagcdn.com/w640/${codeLower}.png`;
  const svgFlagUrl = `https://flagcdn.com/${codeLower}.svg`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name)}`;
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name)}`;

  return (
    <div className="app-container">
      <div className="detail-page-wrapper">
        {/* Navigation Bar */}
        <div className="detail-nav-bar">
          <Link to="/" className="back-button">
            ← Back to all countries
          </Link>
        </div>

        {/* Hero Card */}
        <div className="detail-hero-card">
          <div className="detail-hero-banner">
            <div className="detail-flag-wrapper">
              <img
                src={flagUrl}
                alt={`Flag of ${country.name}`}
                className="detail-flag-image"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="detail-emoji-fallback">
                {getCountryEmoji(country.code)}
              </span>
            </div>

            {country.coatOfArms && (
              <div
                className="detail-coat-of-arms"
                title="Official Coat of Arms"
              >
                <img
                  src={country.coatOfArms}
                  alt={`Coat of arms of ${country.name}`}
                />
              </div>
            )}
          </div>

          <div className="detail-hero-content">
            <div className="detail-title-section">
              <div className="detail-title-row">
                <h1>
                  <span className="detail-flag-icon">
                    {getCountryEmoji(country.code)}
                  </span>
                  {country.name}
                </h1>
                {country.unMember && (
                  <span
                    className="un-badge"
                    title="United Nations Member State"
                  >
                    🇺🇳 UN Member
                  </span>
                )}
              </div>

              {country.officialName &&
                country.officialName !== country.name && (
                  <p className="detail-official-name">{country.officialName}</p>
                )}

              <div className="detail-badge-row">
                <span className="detail-badge region-badge">
                  {country.region}
                </span>
                {country.subregion && (
                  <span className="detail-badge subregion-badge">
                    {country.subregion}
                  </span>
                )}
                <span className="detail-badge code-badge">
                  ISO: {country.code}{" "}
                  {country.code3 ? `/ ${country.code3}` : ""}
                </span>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="detail-quick-actions">
              <a
                href={svgFlagUrl}
                target="_blank"
                rel="noreferrer"
                className="action-btn flag-action"
              >
                📥 High-Res SVG Flag
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="action-btn map-action"
              >
                🗺️ View on Google Maps ↗
              </a>
              <a
                href={wikipediaUrl}
                target="_blank"
                rel="noreferrer"
                className="action-btn wiki-action"
              >
                📖 Wikipedia Article ↗
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <section className="detail-sections-grid">
          {/* Geography & Territory */}
          <div className="detail-card">
            <h3 className="card-section-title">🌍 Geography & Territory</h3>
            <div className="detail-data-list">
              <div className="data-row">
                <span className="data-label">🏛️ Capital</span>
                <span className="data-value">{country.capital || "N/A"}</span>
              </div>
              <div className="data-row">
                <span className="data-label">📍 Region</span>
                <span className="data-value">{country.region}</span>
              </div>
              <div className="data-row">
                <span className="data-label">🧭 Subregion</span>
                <span className="data-value">{country.subregion || "N/A"}</span>
              </div>
              <div className="data-row">
                <span className="data-label">📐 Total Area</span>
                <span className="data-value">
                  {country.area
                    ? `${country.area.toLocaleString()} sq km (${(country.area * 0.386102).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq mi)`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Demographics & Identity */}
          <div className="detail-card">
            <h3 className="card-section-title">👥 Demographics & Identity</h3>
            <div className="detail-data-list">
              <div className="data-row">
                <span className="data-label">👥 Population</span>
                <span className="data-value">
                  {country.population
                    ? `${country.population.toLocaleString()} (${(country.population / 1_000_000).toFixed(2)} Million)`
                    : "N/A"}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">🔤 ISO Alpha-2</span>
                <span className="data-value">{country.code}</span>
              </div>
              <div className="data-row">
                <span className="data-label">🔤 ISO Alpha-3</span>
                <span className="data-value">{country.code3 || "N/A"}</span>
              </div>
              <div className="data-row">
                <span className="data-label">📞 Calling Code</span>
                <span className="data-value">{country.phoneCode || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Culture & Economy */}
          <div className="detail-card full-span">
            <h3 className="card-section-title">💵 Economy & Languages</h3>
            <div className="detail-data-list">
              <div className="data-row">
                <span className="data-label">💵 Currencies</span>
                <span className="data-value">
                  {country.currencies && country.currencies.length > 0
                    ? country.currencies.join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">🗣️ Languages</span>
                <span className="data-value">
                  {country.languages && country.languages.length > 0
                    ? country.languages.join(", ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Timezones */}
          {country.timezones && country.timezones.length > 0 && (
            <div className="detail-card full-span">
              <h3 className="card-section-title">⏰ Timezones</h3>
              <div className="timezone-pills">
                {country.timezones.map((tz) => (
                  <span key={tz} className="timezone-pill">
                    {tz}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Border Countries */}
          {country.borders && country.borders.length > 0 && (
            <div className="detail-card full-span">
              <h3 className="card-section-title">🗺️ Bordering Nations</h3>
              <div className="border-countries-grid">
                {country.borders.map((bCode) => {
                  const neighbor = code3ToCountryMap.get(bCode.toUpperCase());
                  if (neighbor) {
                    return (
                      <Link
                        key={bCode}
                        to={`/country/${neighbor.code.toLowerCase()}`}
                        className="neighbor-card"
                      >
                        <span className="neighbor-emoji">
                          {getCountryEmoji(neighbor.code)}
                        </span>
                        <span className="neighbor-name">{neighbor.name}</span>
                        <span className="neighbor-code">{neighbor.code}</span>
                      </Link>
                    );
                  }
                  return (
                    <span key={bCode} className="neighbor-fallback">
                      {bCode}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
