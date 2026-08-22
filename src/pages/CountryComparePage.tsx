import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FlightIcon from "@mui/icons-material/Flight";
import LanguageIcon from "@mui/icons-material/Language";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PublicIcon from "@mui/icons-material/Public";
import TerrainIcon from "@mui/icons-material/Terrain";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import { UnifiedCountry } from "../types/country";
import {
  calculateDensity,
  findSharedItems,
  formatNumber,
  getTopCountryByMetric,
} from "../utils/comparisonUtils";
import { getCountryEmoji } from "../utils/countryUtils";

const MAX_COMPARE_COUNTRIES = 4;

export default function CountryComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allCountries = [], isLoading } = useCountriesData();

  const [copiedSnackbar, setCopiedSnackbar] = useState(false);

  // Selected country codes from URL query param ?c=US,CA,MX
  const selectedCodes = useMemo(() => {
    const query = searchParams.get("c") || searchParams.get("countries") || "";
    if (!query.trim()) return [];
    return query
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter((code, idx, arr) => code.length > 0 && arr.indexOf(code) === idx)
      .slice(0, MAX_COMPARE_COUNTRIES);
  }, [searchParams]);

  // Selected Country objects
  const selectedCountries = useMemo(() => {
    return selectedCodes
      .map((code) =>
        allCountries.find(
          (c) =>
            c.code.toUpperCase() === code ||
            (c.code3 && c.code3.toUpperCase() === code),
        ),
      )
      .filter((c): c is UnifiedCountry => Boolean(c));
  }, [selectedCodes, allCountries]);

  // Update URL search params
  const updateSelectedCodes = (newCodes: string[]) => {
    const clean = newCodes
      .map((c) => c.toUpperCase().trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE_COUNTRIES);

    if (clean.length === 0) {
      searchParams.delete("c");
      searchParams.delete("countries");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("c", clean.join(","));
      searchParams.delete("countries");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleAddCountry = (country: UnifiedCountry | null) => {
    if (!country) return;
    if (selectedCodes.includes(country.code.toUpperCase())) return;
    if (selectedCodes.length >= MAX_COMPARE_COUNTRIES) return;
    updateSelectedCodes([...selectedCodes, country.code]);
  };

  const handleRemoveCountry = (code: string) => {
    updateSelectedCodes(selectedCodes.filter((c) => c !== code.toUpperCase()));
  };

  const handleClearAll = () => {
    updateSelectedCodes([]);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedSnackbar(true);
  };

  // Metrics for highlights
  const totalPopulation = useMemo(() => {
    return selectedCountries.reduce((acc, c) => acc + (c.population || 0), 0);
  }, [selectedCountries]);

  const totalArea = useMemo(() => {
    return selectedCountries.reduce((acc, c) => acc + (c.area || 0), 0);
  }, [selectedCountries]);

  const topPopulation = useMemo(() => {
    return getTopCountryByMetric(selectedCountries, (c) => c.population);
  }, [selectedCountries]);

  const topArea = useMemo(() => {
    return getTopCountryByMetric(selectedCountries, (c) => c.area);
  }, [selectedCountries]);

  const topAirports = useMemo(() => {
    return getTopCountryByMetric(
      selectedCountries,
      (c) => c.airports?.active ?? 0,
    );
  }, [selectedCountries]);

  // Shared attributes
  const sharedLanguages = useMemo(() => {
    return findSharedItems(selectedCountries.map((c) => c.languages));
  }, [selectedCountries]);

  const sharedCurrencies = useMemo(() => {
    return findSharedItems(selectedCountries.map((c) => c.currencies));
  }, [selectedCountries]);

  // Code3 to Country Map for borders
  const code3ToCountryMap = useMemo(() => {
    const map = new Map<string, UnifiedCountry>();
    allCountries.forEach((c) => {
      if (c.code3) {
        map.set(c.code3.toUpperCase(), c);
      }
    });
    return map;
  }, [allCountries]);

  // Available countries to add (excluding already selected)
  const availableCountries = useMemo(() => {
    const selectedSet = new Set(selectedCodes);
    return allCountries.filter((c) => !selectedSet.has(c.code.toUpperCase()));
  }, [allCountries, selectedCodes]);

  if (isLoading && allCountries.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Loading country comparison data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 1720,
        py: { xs: 2.5, sm: 4 },
        px: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Top Navigation Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.15)",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.light",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
            },
          }}
        >
          Back to Explorer
        </Button>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
        >
          {selectedCountries.length > 0 && (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyLink}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.light",
                    color: "text.primary",
                  },
                }}
              >
                Share Link
              </Button>
              <Button
                variant="text"
                size="small"
                color="inherit"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.light" },
                }}
              >
                Clear All
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {/* Main Title Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Stack spacing={1.5} alignItems="center">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: { xs: "2rem", sm: "2.75rem" },
            }}
          >
            <Box component="span" sx={{ fontSize: "1.1em", lineHeight: 1 }}>
              ⚖️
            </Box>
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Country Comparison
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", maxWidth: 700 }}
          >
            Compare geography, population, economy, culture, and aviation
            infrastructure side-by-side (up to {MAX_COMPARE_COUNTRIES}{" "}
            countries).
          </Typography>
        </Stack>
      </Box>

      {/* Search and Selector Controls */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 4,
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Box sx={{ width: "100%", flexGrow: 1 }}>
              <Autocomplete
                options={availableCountries}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                disabled={selectedCodes.length >= MAX_COMPARE_COUNTRIES}
                onChange={(_, value) => handleAddCountry(value)}
                value={null}
                renderOption={(props, option) => {
                  const flagUrl = `https://flagcdn.com/w40/${option.code.toLowerCase()}.png`;
                  return (
                    <li {...props} key={option.code}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 0.5,
                          px: 1,
                          width: "100%",
                        }}
                      >
                        <Box
                          component="img"
                          src={flagUrl}
                          alt=""
                          sx={{
                            width: 24,
                            height: 16,
                            borderRadius: 0.5,
                            objectFit: "cover",
                          }}
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>,
                          ) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.name}{" "}
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              ({option.code})
                            </Typography>
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", display: "block" }}
                          >
                            🏛️ {option.capital || "N/A"} • 🌐 {option.region}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      selectedCodes.length >= MAX_COMPARE_COUNTRIES
                        ? `Maximum limit of ${MAX_COMPARE_COUNTRIES} countries reached`
                        : "Type to search and add a country to compare..."
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <AddIcon
                            sx={{ color: "primary.light", mr: 1, ml: 0.5 }}
                          />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.light",
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Comparison View Content */}
      {selectedCountries.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderStyle: "dashed",
            borderColor: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography sx={{ fontSize: "3.5rem" }}>⚖️</Typography>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              No Countries Selected for Comparison
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
              Search and add countries above to explore side-by-side comparisons
              of demographics, geography, culture, economy, and aviation
              infrastructure.
            </Typography>
          </Stack>
        </Paper>
      ) : selectedCountries.length === 1 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderStyle: "dashed",
            borderColor: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography sx={{ fontSize: "3rem" }}>
              {getCountryEmoji(selectedCountries[0].code)}
            </Typography>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              Add at least one more country
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
              You have currently selected{" "}
              <strong>{selectedCountries[0].name}</strong>. Add another country
              above to unlock side-by-side insights and ratio distributions.
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Stack spacing={4}>
          {/* Header Country Columns Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: `repeat(${selectedCountries.length}, minmax(0, 1fr))`,
              },
              gap: 2,
            }}
          >
            {selectedCountries.map((country) => {
              const codeLower = country.code.toLowerCase();
              const flagUrl = `https://flagcdn.com/w320/${codeLower}.png`;

              return (
                <Card
                  key={country.code}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  }}
                >
                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveCountry(country.code)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      backgroundColor: "rgba(15, 23, 42, 0.7)",
                      backdropFilter: "blur(8px)",
                      color: "text.secondary",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.8)",
                        color: "#ffffff",
                      },
                    }}
                    title={`Remove ${country.name}`}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* Flag Banner */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      backgroundColor: "#020617",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={flagUrl}
                      alt={`Flag of ${country.name}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        fontSize: "3rem",
                        pointerEvents: "none",
                      }}
                    >
                      {getCountryEmoji(country.code)}
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              fontSize: "1.1rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={country.name}
                          >
                            {country.name}
                          </Typography>
                          <Stack direction="row" spacing={0.5}>
                            <Chip
                              size="small"
                              label={country.code}
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(99, 102, 241, 0.2)",
                                color: "primary.light",
                              }}
                            />
                            {country.code3 && (
                              <Chip
                                size="small"
                                label={country.code3}
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  backgroundColor: "rgba(168, 85, 247, 0.2)",
                                  color: "secondary.light",
                                }}
                              />
                            )}
                          </Stack>
                        </Stack>

                        {country.officialName && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mt: 0.25,
                            }}
                            title={country.officialName}
                          >
                            {country.officialName}
                          </Typography>
                        )}
                      </Box>

                      <Button
                        component={RouterLink}
                        to={`/country/${country.code.toLowerCase()}`}
                        target="_blank"
                        rel="noopener"
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        fullWidth
                        sx={{
                          fontSize: "0.75rem",
                          py: 0.5,
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Full Details
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Key Metrics Comparison Bars (Visual Gauge Section) */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3.5,
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TerrainIcon sx={{ color: "primary.light" }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Visual Metric Distribution
                </Typography>
              </Stack>

              {/* Population Bar Breakdown */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    👥 Population Comparison
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Combined: {formatNumber(totalPopulation)}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: `repeat(${selectedCountries.length}, minmax(0, 1fr))`,
                    },
                    gap: 1.5,
                  }}
                >
                  {selectedCountries.map((c) => {
                    const pct =
                      totalPopulation > 0
                        ? ((c.population || 0) / totalPopulation) * 100
                        : 0;
                    const isTop = topPopulation.topIds.includes(c.code);

                    return (
                      <Paper
                        key={c.code}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: isTop
                            ? "rgba(99, 102, 241, 0.1)"
                            : "rgba(15, 23, 42, 0.4)",
                          borderColor: isTop
                            ? "primary.main"
                            : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Stack spacing={0.75}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700 }}
                            >
                              {c.name}
                            </Typography>
                            {isTop && selectedCountries.length > 1 && (
                              <Chip
                                label="Largest 👑"
                                size="small"
                                color="primary"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                              />
                            )}
                          </Stack>

                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {formatNumber(c.population)}
                          </Typography>

                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "rgba(255, 255, 255, 0.08)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: isTop
                                  ? "primary.main"
                                  : "secondary.main",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              textAlign: "right",
                              fontSize: "0.7rem",
                            }}
                          >
                            {pct.toFixed(1)}% of total
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

              {/* Land Area Breakdown */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    🗺️ Land Area Comparison
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Combined: {formatNumber(totalArea)} km²
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: `repeat(${selectedCountries.length}, minmax(0, 1fr))`,
                    },
                    gap: 1.5,
                  }}
                >
                  {selectedCountries.map((c) => {
                    const pct =
                      totalArea > 0 ? ((c.area || 0) / totalArea) * 100 : 0;
                    const isTop = topArea.topIds.includes(c.code);

                    return (
                      <Paper
                        key={c.code}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: isTop
                            ? "rgba(168, 85, 247, 0.1)"
                            : "rgba(15, 23, 42, 0.4)",
                          borderColor: isTop
                            ? "secondary.main"
                            : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Stack spacing={0.75}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700 }}
                            >
                              {c.name}
                            </Typography>
                            {isTop && selectedCountries.length > 1 && (
                              <Chip
                                label="Largest 🌍"
                                size="small"
                                color="secondary"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                              />
                            )}
                          </Stack>

                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {c.area ? `${formatNumber(c.area)} km²` : "N/A"}
                          </Typography>

                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "rgba(255, 255, 255, 0.08)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "secondary.main",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              textAlign: "right",
                              fontSize: "0.7rem",
                            }}
                          >
                            {pct.toFixed(1)}% of total
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

              {/* Aviation Leader Breakdown */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ✈️ Active Airports Infrastructure
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: `repeat(${selectedCountries.length}, minmax(0, 1fr))`,
                    },
                    gap: 1.5,
                  }}
                >
                  {selectedCountries.map((c) => {
                    const activeCount = c.airports?.active ?? 0;
                    const isTop = topAirports.topIds.includes(c.code);

                    return (
                      <Paper
                        key={c.code}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: isTop
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(15, 23, 42, 0.4)",
                          borderColor: isTop
                            ? "info.main"
                            : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Stack spacing={0.75}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700 }}
                            >
                              {c.name}
                            </Typography>
                            {isTop && selectedCountries.length > 1 && (
                              <Chip
                                label="Top Hub ✈️"
                                size="small"
                                color="info"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                              />
                            )}
                          </Stack>

                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {formatNumber(activeCount)} active
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {c.airports?.large ?? 0} large hubs •{" "}
                            {c.airports?.medium ?? 0} medium airports
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Detailed Categorical Tables */}
          {/* 1. Geography & Demographics */}
          <ComparisonSection
            title="Geography & Demographics"
            icon={<PublicIcon sx={{ color: "primary.light" }} />}
            countries={selectedCountries}
            rows={[
              {
                label: "Capital City",
                render: (c) => (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    🏛️ {c.capital || "N/A"}
                  </Typography>
                ),
              },
              {
                label: "Region / Subregion",
                render: (c) => (
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {c.region}
                    </Typography>
                    {c.subregion && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {c.subregion}
                      </Typography>
                    )}
                  </Stack>
                ),
              },
              {
                label: "Population",
                render: (c) => {
                  const isTop = topPopulation.topIds.includes(c.code);
                  return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatNumber(c.population)}
                      </Typography>
                      {isTop && selectedCountries.length > 1 && (
                        <Chip
                          label="Top"
                          size="small"
                          color="primary"
                          sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                      )}
                    </Stack>
                  );
                },
              },
              {
                label: "Land Area",
                render: (c) => {
                  const isTop = topArea.topIds.includes(c.code);
                  return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {c.area ? `${formatNumber(c.area)} km²` : "N/A"}
                      </Typography>
                      {isTop && selectedCountries.length > 1 && (
                        <Chip
                          label="Top"
                          size="small"
                          color="secondary"
                          sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                      )}
                    </Stack>
                  );
                },
              },
              {
                label: "Population Density",
                render: (c) => {
                  const density = calculateDensity(c.population, c.area);
                  return (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {density !== null
                        ? `${density.toLocaleString()} / km²`
                        : "N/A"}
                    </Typography>
                  );
                },
              },
              {
                label: "Landlocked",
                render: (c) => (
                  <Chip
                    size="small"
                    label={c.landlocked ? "Landlocked" : "Coastal / Island"}
                    variant={c.landlocked ? "filled" : "outlined"}
                    color={c.landlocked ? "warning" : "default"}
                    sx={{ height: 22, fontSize: "0.75rem" }}
                  />
                ),
              },
              {
                label: "Border Countries",
                render: (c) => {
                  if (!c.borders || c.borders.length === 0) {
                    return (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        No land borders (Island/Territory)
                      </Typography>
                    );
                  }
                  return (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      sx={{ gap: 0.5 }}
                    >
                      {c.borders.map((borderCode) => {
                        const borderCountry = code3ToCountryMap.get(
                          borderCode.toUpperCase(),
                        );
                        return (
                          <Chip
                            key={borderCode}
                            size="small"
                            label={
                              borderCountry ? borderCountry.name : borderCode
                            }
                            variant="outlined"
                            component={RouterLink}
                            to={`/country/${(borderCountry?.code || borderCode).toLowerCase()}`}
                            clickable
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              backgroundColor: "rgba(15, 23, 42, 0.4)",
                            }}
                          />
                        );
                      })}
                    </Stack>
                  );
                },
              },
            ]}
          />

          {/* 2. Culture, Language & Governance */}
          <ComparisonSection
            title="Culture, Languages & Governance"
            icon={<LanguageIcon sx={{ color: "secondary.light" }} />}
            countries={selectedCountries}
            rows={[
              {
                label: "Spoken Languages",
                render: (c) => {
                  if (!c.languages || c.languages.length === 0) {
                    return (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        N/A
                      </Typography>
                    );
                  }
                  return (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      sx={{ gap: 0.5 }}
                    >
                      {c.languages.map((lang) => {
                        const isShared = sharedLanguages.has(lang);
                        return (
                          <Chip
                            key={lang}
                            size="small"
                            label={lang}
                            color={isShared ? "primary" : "default"}
                            variant={isShared ? "filled" : "outlined"}
                            sx={{
                              height: 22,
                              fontSize: "0.75rem",
                              fontWeight: isShared ? 700 : 500,
                            }}
                          />
                        );
                      })}
                    </Stack>
                  );
                },
              },
              {
                label: "Currencies",
                render: (c) => {
                  if (!c.currencies || c.currencies.length === 0) {
                    return (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        N/A
                      </Typography>
                    );
                  }
                  return (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      sx={{ gap: 0.5 }}
                    >
                      {c.currencies.map((curr) => {
                        const isShared = sharedCurrencies.has(curr);
                        return (
                          <Chip
                            key={curr}
                            size="small"
                            label={curr}
                            color={isShared ? "secondary" : "default"}
                            variant={isShared ? "filled" : "outlined"}
                            sx={{
                              height: 22,
                              fontSize: "0.75rem",
                              fontWeight: isShared ? 700 : 500,
                            }}
                          />
                        );
                      })}
                    </Stack>
                  );
                },
              },
              {
                label: "Calling Code",
                render: (c) => (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {c.phoneCode ? `📞 ${c.phoneCode}` : "N/A"}
                  </Typography>
                ),
              },
              {
                label: "Timezones",
                render: (c) => (
                  <Stack spacing={0.75}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {c.timezones?.length ?? 0} timezone
                      {(c.timezones?.length ?? 0) === 1 ? "" : "s"}
                    </Typography>
                    {c.timezones && c.timezones.length > 0 ? (
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {c.timezones.map((tz) => (
                          <Chip
                            key={tz}
                            label={tz}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              backgroundColor: "rgba(15, 23, 42, 0.4)",
                              borderColor: "rgba(255, 255, 255, 0.1)",
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Stack>
                ),
              },
              {
                label: "UN Membership",
                render: (c) => (
                  <Chip
                    size="small"
                    label={
                      c.unMember ? "UN Member State" : "Non-Member / Observer"
                    }
                    color={c.unMember ? "success" : "default"}
                    variant="outlined"
                    sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
                  />
                ),
              },
            ]}
          />

          {/* 3. Aviation & Infrastructure */}
          <ComparisonSection
            title="Aviation & Airport Infrastructure"
            icon={<FlightIcon sx={{ color: "info.light" }} />}
            countries={selectedCountries}
            rows={[
              {
                label: "Active Airports",
                render: (c) => (
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatNumber(c.airports?.active ?? 0)}
                  </Typography>
                ),
              },
              {
                label: "Large Hubs",
                render: (c) => {
                  const majorAirports = c.airports?.majorAirports?.filter(
                    (a) => a.type === "large_airport",
                  );
                  return (
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatNumber(c.airports?.large ?? 0)}
                      </Typography>
                      {majorAirports && majorAirports.length > 0 && (
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {majorAirports
                            .slice(0, 3)
                            .map((a) => a.iata || a.name)
                            .join(", ")}
                          {majorAirports.length > 3 ? "..." : ""}
                        </Typography>
                      )}
                    </Stack>
                  );
                },
              },
              {
                label: "Medium Airports",
                render: (c) => (
                  <Typography variant="body2">
                    {formatNumber(c.airports?.medium ?? 0)}
                  </Typography>
                ),
              },
              {
                label: "Small Airports",
                render: (c) => (
                  <Typography variant="body2">
                    {formatNumber(c.airports?.small ?? 0)}
                  </Typography>
                ),
              },
              {
                label: "Heliports",
                render: (c) => (
                  <Typography variant="body2">
                    {formatNumber(c.airports?.heliport ?? 0)}
                  </Typography>
                ),
              },
              {
                label: "Seaplane Bases",
                render: (c) => (
                  <Typography variant="body2">
                    {formatNumber(c.airports?.seaplane ?? 0)}
                  </Typography>
                ),
              },
              {
                label: "Scheduled Service",
                render: (c) => (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatNumber(c.airports?.scheduled ?? 0)} airports
                  </Typography>
                ),
              },
            ]}
          />
        </Stack>
      )}

      {/* Snackbar feedback for copying link */}
      <Snackbar
        open={copiedSnackbar}
        autoHideDuration={3000}
        onClose={() => setCopiedSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopiedSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Comparison link copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}

interface RowDef {
  label: string;
  render: (country: UnifiedCountry) => React.ReactNode;
}

interface ComparisonSectionProps {
  title: string;
  icon: React.ReactNode;
  countries: UnifiedCountry[];
  rows: RowDef[];
}

function ComparisonSection({
  title,
  icon,
  countries,
  rows,
}: ComparisonSectionProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3.5,
        backgroundColor: "rgba(30, 41, 59, 0.7)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Stack>
      </Box>

      {/* Rows */}
      <Box>
        {rows.map((row, rIdx) => (
          <Box
            key={row.label}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: `200px repeat(${countries.length}, minmax(0, 1fr))`,
              },
              p: 2,
              backgroundColor:
                rIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
              borderBottom:
                rIdx === rows.length - 1
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.05)",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {/* Row Label */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              {row.label}
            </Typography>

            {/* Country Cells */}
            {countries.map((c) => (
              <Box key={c.code} sx={{ minWidth: 0 }}>
                {row.render(c)}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
