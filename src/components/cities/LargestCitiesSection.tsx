import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { CityInfo, UnifiedCountry } from "../../types/country";
import {
  calculateCityShare,
  formatCityPopulation,
  formatCityPopulationExact,
  formatCityShare,
  getCapitalCityFromList,
  getCityGoogleMapsUrl,
  getCityWikipediaUrl,
  getCombinedCitiesPopulation,
  getPrimateCity,
} from "../../utils/cityUtils";

interface LargestCitiesSectionProps {
  country: UnifiedCountry;
}

export const LargestCitiesSection: React.FC<LargestCitiesSectionProps> = ({
  country,
}) => {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const cities = country.cities || [];
  const primateCity = useMemo(() => getPrimateCity(cities), [cities]);
  const capitalCity = useMemo(() => getCapitalCityFromList(cities), [cities]);
  const combinedPop = useMemo(
    () => getCombinedCitiesPopulation(cities),
    [cities],
  );

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.adminName && c.adminName.toLowerCase().includes(q)),
    );
  }, [cities, search]);

  const displayedCities = useMemo(() => {
    if (search.trim() || showAll) {
      return filteredCities;
    }
    return filteredCities.slice(0, 6);
  }, [filteredCities, search, showAll]);

  const combinedShare = useMemo(() => {
    if (!country.population || country.population <= 0) return 0;
    return Math.min(100, (combinedPop / country.population) * 100);
  }, [combinedPop, country.population]);

  const isPrimateCapital = primateCity?.isCapital;

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Header Bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1.5}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            <LocationCityIcon sx={{ color: "primary.main", fontSize: 26 }} />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              Largest Cities & Urban Centers
            </Typography>

            {cities.length > 0 && (
              <Chip
                label={`${cities.length} ${cities.length === 1 ? "City" : "Major Cities"}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  height: 22,
                  fontSize: "0.75rem",
                }}
              />
            )}

            {primateCity && (
              <Chip
                label={
                  isPrimateCapital
                    ? "🏛️ Capital is Largest City"
                    : `👑 Largest: ${primateCity.name}`
                }
                size="small"
                sx={{
                  backgroundColor: isPrimateCapital
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(56, 189, 248, 0.15)",
                  color: isPrimateCapital ? "#10b981" : "#38bdf8",
                  border: "1px solid",
                  borderColor: isPrimateCapital
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(56, 189, 248, 0.3)",
                  fontWeight: 600,
                  height: 22,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Stack>

          <Typography
            component="a"
            href="https://www.geonames.org/"
            target="_blank"
            rel="noreferrer"
            variant="caption"
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            Source: GeoNames Open Data ↗
          </Typography>
        </Stack>

        <Divider />

        {cities.length > 0 ? (
          <Stack spacing={3}>
            {/* Quick Metrics Bar */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {/* Largest City */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Most Populous City
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "primary.light",
                    mt: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={primateCity?.name}
                >
                  {primateCity ? primateCity.name : "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {primateCity
                    ? `${formatCityPopulation(primateCity.population)} residents (${formatCityShare(primateCity.population, country.population)})`
                    : "No data"}
                </Typography>
              </Paper>

              {/* Capital City */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  National Capital
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#38bdf8",
                    mt: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={country.capital || "N/A"}
                >
                  {country.capital || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {capitalCity
                    ? `Rank #${capitalCity.rank || "—"} • ${formatCityPopulation(capitalCity.population)}`
                    : country.capital
                      ? "Official Seat of Government"
                      : "No official capital"}
                </Typography>
              </Paper>

              {/* Combined Top Cities Population */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Combined Urban Hubs
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#a855f7",
                    mt: 0.5,
                  }}
                >
                  {formatCityPopulation(combinedPop)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {combinedShare > 0
                    ? `${combinedShare.toFixed(1)}% of total population`
                    : "Urban center total"}
                </Typography>
              </Paper>

              {/* Cities Tracked */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Cities Cataloged
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#10b981",
                    mt: 0.5,
                  }}
                >
                  {cities.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {country.gdp?.urbanPopulation !== undefined
                    ? `${country.gdp.urbanPopulation.toFixed(1)}% national urbanization`
                    : "Major metropolitan centers"}
                </Typography>
              </Paper>
            </Box>

            {/* Filter Input */}
            {cities.length > 3 && (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Search ${cities.length} major cities by name, state, or province...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: search ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearch("")}
                            edge="end"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                  sx={{
                    maxWidth: { xs: "100%", sm: 420 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                    },
                  }}
                />
              </Box>
            )}

            {/* City Cards Grid */}
            {displayedCities.length === 0 ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(15, 23, 42, 0.3)",
                }}
              >
                <Typography color="text.secondary">
                  No cities match &ldquo;{search}&rdquo;
                </Typography>
                <Button
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ mt: 1, textTransform: "none" }}
                >
                  Clear search
                </Button>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 1.75,
                }}
              >
                {displayedCities.map((city: CityInfo) => {
                  const rank = city.rank || 1;
                  const rankBadgeColor =
                    rank === 1
                      ? {
                          bg: "rgba(234, 179, 8, 0.15)",
                          border: "rgba(234, 179, 8, 0.4)",
                          text: "#eab308",
                        }
                      : rank === 2
                        ? {
                            bg: "rgba(148, 163, 184, 0.18)",
                            border: "rgba(148, 163, 184, 0.35)",
                            text: "#cbd5e1",
                          }
                        : rank === 3
                          ? {
                              bg: "rgba(217, 119, 6, 0.18)",
                              border: "rgba(217, 119, 6, 0.35)",
                              text: "#f59e0b",
                            }
                          : {
                              bg: "rgba(255, 255, 255, 0.05)",
                              border: "rgba(255, 255, 255, 0.1)",
                              text: "#94a3b8",
                            };

                  const share = calculateCityShare(
                    city.population,
                    country.population,
                  );
                  const mapsUrl = getCityGoogleMapsUrl(city.name, country.name);
                  const wikiUrl = getCityWikipediaUrl(city.name);

                  return (
                    <Paper
                      key={`${city.name}-${city.rank}`}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        backgroundColor: "rgba(30, 41, 59, 0.3)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        transition:
                          "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, box-shadow 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 1.5,
                        "&:hover": {
                          borderColor: "rgba(99, 102, 241, 0.5)",
                          transform: "translateY(-3px)",
                          boxShadow:
                            "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(99, 102, 241, 0.15)",
                        },
                      }}
                    >
                      {/* Top Row: Rank & Badges & External links */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              px: 0.9,
                              py: 0.25,
                              borderRadius: 1.5,
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              backgroundColor: rankBadgeColor.bg,
                              border: `1px solid ${rankBadgeColor.border}`,
                              color: rankBadgeColor.text,
                              letterSpacing: 0.5,
                            }}
                          >
                            #{rank}
                          </Box>

                          {city.isCapital && (
                            <Chip
                              label="🏛️ Capital"
                              size="small"
                              sx={{
                                backgroundColor: "rgba(99, 102, 241, 0.18)",
                                color: "#a5b4fc",
                                border: "1px solid rgba(99, 102, 241, 0.35)",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Stack>

                        {/* Quick links to Google Maps & Wikipedia */}
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip
                            title={`Search ${city.name} on Google Maps`}
                            arrow
                          >
                            <IconButton
                              component="a"
                              href={mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              size="small"
                              sx={{
                                p: 0.5,
                                color: "text.secondary",
                                "&:hover": {
                                  color: "primary.light",
                                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                                },
                              }}
                            >
                              <MapIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={`Read about ${city.name} on Wikipedia`}
                            arrow
                          >
                            <IconButton
                              component="a"
                              href={wikiUrl}
                              target="_blank"
                              rel="noreferrer"
                              size="small"
                              sx={{
                                p: 0.5,
                                color: "text.secondary",
                                "&:hover": {
                                  color: "#38bdf8",
                                  backgroundColor: "rgba(56, 189, 248, 0.15)",
                                },
                              }}
                            >
                              <MenuBookIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>

                      {/* City Name & Admin division */}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            lineHeight: 1.25,
                          }}
                        >
                          {city.name}
                        </Typography>

                        {city.adminName && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              mt: 0.3,
                            }}
                          >
                            📍 {city.adminName}
                          </Typography>
                        )}
                      </Box>

                      {/* Population Metric and Progress Bar */}
                      <Box sx={{ pt: 0.5 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                          sx={{ mb: 0.75 }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600 }}
                          >
                            👥 Population
                          </Typography>
                          <Tooltip
                            title={`Exact: ${formatCityPopulationExact(city.population)} residents`}
                            arrow
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 800,
                                color: "primary.light",
                                cursor: "help",
                              }}
                            >
                              {formatCityPopulation(city.population)}
                            </Typography>
                          </Tooltip>
                        </Stack>

                        {/* National population share bar */}
                        {country.population > 0 && (
                          <Box>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 0.4 }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "0.7rem",
                                  color: "text.secondary",
                                }}
                              >
                                Share of Country
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  color: "text.secondary",
                                }}
                              >
                                {formatCityShare(
                                  city.population,
                                  country.population,
                                )}
                              </Typography>
                            </Stack>

                            <Box
                              sx={{
                                width: "100%",
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${Math.max(2, Math.min(100, share))}%`,
                                  height: "100%",
                                  borderRadius: 2.5,
                                  backgroundColor:
                                    rank === 1
                                      ? "#6366f1"
                                      : rank <= 3
                                        ? "#38bdf8"
                                        : "rgba(148, 163, 184, 0.7)",
                                  transition: "width 0.4s ease",
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Show All / Show Fewer Toggle */}
            {!search.trim() && filteredCities.length > 6 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAll((prev) => !prev)}
                  endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  {showAll
                    ? "Show fewer cities"
                    : `Show all ${filteredCities.length} major cities`}
                </Button>
              </Box>
            )}
          </Stack>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "rgba(30, 41, 59, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Typography
              color="text.secondary"
              sx={{ fontStyle: "italic", fontSize: "0.95rem" }}
            >
              No permanent metropolitan cities or civilian settlements recorded
              for this territory.
            </Typography>
            {country.capital && country.capital !== "N/A" && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "primary.light" }}
              >
                Official administrative center:{" "}
                <strong>{country.capital}</strong>
              </Typography>
            )}
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default LargestCitiesSection;
