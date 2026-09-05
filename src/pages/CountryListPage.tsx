import ClearIcon from "@mui/icons-material/Clear";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import CompareFloatingDock from "../components/compare/CompareFloatingDock";
import { getCountryEmoji } from "../utils/countryUtils";
import { matchesBlocQuery } from "../utils/blocUtils";
import {
  TAX_FILTER_OPTIONS,
  getTaxBadgeConfig,
  matchesTaxFilter,
  matchesTaxQuery,
} from "../utils/taxUtils";

const REGIONS = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

const MAX_COMPARE_COUNTRIES = 4;
const INITIAL_BATCH_SIZE = 36;
const LOAD_MORE_STEP = 36;

export default function CountryListPage() {
  const { data: countries = [], isLoading, isError } = useCountriesData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedTaxRegime, setSelectedTaxRegime] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [selectedCompareCodes, setSelectedCompareCodes] = useState<string[]>(
    [],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [searchTerm, selectedRegion, selectedTaxRegime]);

  const handleToggleCompare = (code: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const upperCode = code.toUpperCase();
    if (selectedCompareCodes.includes(upperCode)) {
      setSelectedCompareCodes((prev) => prev.filter((c) => c !== upperCode));
    } else {
      if (selectedCompareCodes.length >= MAX_COMPARE_COUNTRIES) {
        return;
      }
      setSelectedCompareCodes((prev) => [...prev, upperCode]);
    }
  };

  const handleRemoveCompare = (code: string) => {
    setSelectedCompareCodes((prev) =>
      prev.filter((c) => c !== code.toUpperCase()),
    );
  };

  const handleClearCompare = () => {
    setSelectedCompareCodes([]);
  };

  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // Filter by Region
    if (selectedRegion !== "All") {
      result = result.filter(
        (c) => c.region.toLowerCase() === selectedRegion.toLowerCase(),
      );
    }

    // Filter by Tax Regime
    if (selectedTaxRegime !== "all") {
      result = result.filter((c) => matchesTaxFilter(c, selectedTaxRegime));
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
          (c.capital && c.capital.toLowerCase().includes(query)) ||
          matchesTaxQuery(c, query) ||
          matchesBlocQuery(c, query) ||
          (c.airports?.majorAirports?.some(
            (a) =>
              (a.iata && a.iata.toLowerCase().includes(query)) ||
              a.name.toLowerCase().includes(query),
          ) ??
            false),
      );
    }

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [countries, searchTerm, selectedRegion, selectedTaxRegime]);

  const visibleCountries = useMemo(() => {
    return filteredCountries.slice(0, visibleCount);
  }, [filteredCountries, visibleCount]);

  const hasMore = visibleCount < filteredCountries.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, filteredCountries.length),
    );
  }, [filteredCountries.length]);

  // IntersectionObserver to auto-load more items seamlessly before reaching the bottom
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "350px" },
    );

    const el = sentinelRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [hasMore, handleLoadMore]);

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 1720,
        py: { xs: 2.5, sm: 4 },
        px: { xs: 1.5, sm: 3 },
        pb: selectedCompareCodes.length > 0 ? 12 : { xs: 2.5, sm: 4 },
      }}
    >
      {/* Header Section */}
      <Box component="header" sx={{ mb: 4, textAlign: "center" }}>
        <Stack spacing={2.5} alignItems="center">
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
              🌍
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
              Countries
            </Box>
          </Typography>

          {/* Compare Shortcuts Button */}
          <Button
            component={RouterLink}
            to="/compare"
            startIcon={<CompareArrowsIcon />}
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: "rgba(99, 102, 241, 0.4)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "primary.light",
              px: 2.5,
              py: 0.75,
              fontSize: "0.85rem",
              fontWeight: 700,
              "&:hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            Compare Countries
          </Button>

          {/* Search and Filter Section */}
          <Box sx={{ width: "100%", maxWidth: 840 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search countries, examine flags, capitals, languages, and geographic info..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Clear search"
                        onClick={() => setSearchTerm("")}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: {
                    borderRadius: 3.5,
                    backgroundColor: "rgba(30, 41, 59, 0.7)",
                    backdropFilter: "blur(12px)",
                    fontSize: "0.95rem",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.light",
                    },
                  },
                }}
              />

              {/* Region Filter Chips */}
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
                gap={1}
              >
                {REGIONS.map((region) => {
                  const isActive = selectedRegion === region;
                  return (
                    <Chip
                      key={region}
                      label={region}
                      clickable
                      onClick={() => setSelectedRegion(region)}
                      color={isActive ? "primary" : "default"}
                      variant={isActive ? "filled" : "outlined"}
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        py: 2,
                        px: 0.5,
                        borderRadius: 2.5,
                        borderColor: isActive
                          ? "primary.main"
                          : "rgba(255, 255, 255, 0.1)",
                        backgroundColor: isActive
                          ? "primary.main"
                          : "rgba(30, 41, 59, 0.5)",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "primary.dark"
                            : "rgba(30, 41, 59, 0.8)",
                        },
                      }}
                    />
                  );
                })}
              </Stack>

              {/* Tax Regime Filter Chips */}
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                gap={1}
                sx={{ pt: 0.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    mr: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  💰 Tax:
                </Typography>
                {TAX_FILTER_OPTIONS.map((opt) => {
                  const isActive = selectedTaxRegime === opt.id;
                  return (
                    <Chip
                      key={opt.id}
                      icon={
                        <span style={{ fontSize: "0.85rem", marginLeft: 4 }}>
                          {opt.icon}
                        </span>
                      }
                      label={opt.label}
                      clickable
                      onClick={() => setSelectedTaxRegime(opt.id)}
                      size="small"
                      variant={isActive ? "filled" : "outlined"}
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: 2,
                        borderColor: isActive
                          ? "secondary.main"
                          : "rgba(255, 255, 255, 0.12)",
                        backgroundColor: isActive
                          ? "rgba(168, 85, 247, 0.25)"
                          : "rgba(30, 41, 59, 0.4)",
                        color: isActive ? "#d8b4fe" : "text.secondary",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "rgba(168, 85, 247, 0.35)"
                            : "rgba(30, 41, 59, 0.7)",
                          color: "text.primary",
                        },
                      }}
                    />
                  );
                })}
              </Stack>

              {/* Results Count & Filter Feedback */}
              {!isLoading && filteredCountries.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    textAlign: "center",
                    mt: 0.5,
                  }}
                >
                  Showing {visibleCountries.length} of{" "}
                  {filteredCountries.length}{" "}
                  {filteredCountries.length === 1 ? "country" : "countries"}
                  {selectedRegion !== "All" && ` • ${selectedRegion}`}
                  {selectedTaxRegime !== "all" &&
                    ` • ${TAX_FILTER_OPTIONS.find((t) => t.id === selectedTaxRegime)?.label}`}
                  {searchTerm && ` • Matching "${searchTerm}"`}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main Grid Content */}
      <Box component="main" sx={{ width: "100%" }}>
        {isLoading && countries.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderStyle: "dashed",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress color="primary" />
              <Typography color="text.secondary">
                Loading country details...
              </Typography>
            </Stack>
          </Paper>
        ) : isError && countries.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderStyle: "dashed",
            }}
          >
            <Stack spacing={1.5} alignItems="center">
              <WarningAmberIcon sx={{ fontSize: 48, color: "warning.main" }} />
              <Typography variant="h5" component="h2">
                Unable to load country details
              </Typography>
              <Typography color="text.secondary">
                Please check your network connection and try again.
              </Typography>
            </Stack>
          </Paper>
        ) : filteredCountries.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderStyle: "dashed",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Typography sx={{ fontSize: "3rem" }}>🏳️</Typography>
              <Typography variant="h5" component="h2">
                No matching countries found
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search criteria or region filter.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ReplayIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("All");
                  setSelectedTaxRegime("all");
                }}
              >
                Reset Filters
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                  xl: "repeat(8, 1fr)",
                },
                gap: 1.25,
              }}
            >
              {visibleCountries.map((country) => {
                const codeLower = country.code.toLowerCase();
                const flagUrl = `https://flagcdn.com/w320/${codeLower}.png`;
                const isCompared = selectedCompareCodes.includes(
                  country.code.toUpperCase(),
                );
                const taxBadge = getTaxBadgeConfig(country.tax);

                return (
                  <Card
                    key={country.code}
                    variant="outlined"
                    sx={{
                      borderRadius: 2.5,
                      position: "relative",
                      borderColor: isCompared
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.08)",
                      boxShadow: isCompared
                        ? "0 0 0 1.5px rgba(99, 102, 241, 0.6), 0 8px 24px rgba(0, 0, 0, 0.35)"
                        : "none",
                      transition:
                        "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "primary.light",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                      },
                    }}
                  >
                    {/* Compare Toggle Button */}
                    <Tooltip
                      title={
                        isCompared
                          ? `Remove ${country.name} from compare`
                          : `Compare ${country.name}`
                      }
                      arrow
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => handleToggleCompare(country.code, e)}
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          zIndex: 2,
                          p: 0.4,
                          borderRadius: 1.5,
                          backgroundColor: isCompared
                            ? "primary.main"
                            : "rgba(15, 23, 42, 0.75)",
                          backdropFilter: "blur(8px)",
                          color: isCompared ? "#ffffff" : "text.secondary",
                          border: "1px solid",
                          borderColor: isCompared
                            ? "primary.light"
                            : "rgba(255, 255, 255, 0.15)",
                          "&:hover": {
                            backgroundColor: isCompared
                              ? "primary.dark"
                              : "rgba(99, 102, 241, 0.6)",
                            color: "#ffffff",
                            borderColor: "primary.main",
                            transform: "scale(1.08)",
                          },
                        }}
                      >
                        <CompareArrowsIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>

                    <CardActionArea
                      onClick={() =>
                        navigate(`/country/${country.code.toLowerCase()}`)
                      }
                      title={`${country.name} (${country.code})`}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                      }}
                    >
                      {/* Flag Media Wrapper */}
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 10",
                          minHeight: 70,
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
                          loading="lazy"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>,
                          ) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <Typography
                          sx={{
                            position: "absolute",
                            fontSize: "2.2rem",
                            zIndex: 0,
                            pointerEvents: "none",
                          }}
                        >
                          {getCountryEmoji(country.code)}
                        </Typography>
                      </Box>

                      {/* Card Content Info */}
                      <CardContent
                        sx={{
                          p: 1,
                          "&:last-child": { pb: 1 },
                          backgroundColor: "rgba(15, 23, 42, 0.6)",
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.25,
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={0.5}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={country.name}
                          >
                            {country.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={country.code}
                            sx={{
                              height: 18,
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              backgroundColor: "rgba(99, 102, 241, 0.2)",
                              color: "primary.light",
                              border: "1px solid rgba(99, 102, 241, 0.3)",
                              borderRadius: 1,
                              "& .MuiChip-label": { px: 0.5 },
                            }}
                          />
                        </Stack>

                        {country.capital && country.capital !== "N/A" && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.75rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={`Capital: ${country.capital}`}
                          >
                            🏛️ {country.capital}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mt: 0.25,
                          }}
                          title={country.region}
                        >
                          {country.region}
                        </Typography>

                        {country.airports && country.airports.active > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(148, 163, 184, 0.85)",
                              fontSize: "0.68rem",
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.2,
                            }}
                            title={`${country.airports.active.toLocaleString()} active airports${country.airports.large > 0 ? ` (${country.airports.large} major hubs)` : ""}`}
                          >
                            <span>✈️</span>
                            {country.airports.active.toLocaleString()} airports
                          </Typography>
                        )}

                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={0.5}
                          sx={{ mt: 0.3 }}
                        >
                          {country.tax && (
                            <Tooltip
                              title={`${country.tax.systemLabel} • Foreign: ${country.tax.foreignIncomeTaxRate}`}
                              arrow
                            >
                              <Chip
                                size="small"
                                icon={
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      marginLeft: 3,
                                    }}
                                  >
                                    {taxBadge.icon}
                                  </span>
                                }
                                label={taxBadge.shortLabel}
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  backgroundColor: taxBadge.backgroundColor,
                                  color: taxBadge.textColor,
                                  border: `1px solid ${taxBadge.borderColor}`,
                                  borderRadius: 1,
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                            </Tooltip>
                          )}

                          {country.blocs?.isG7 && (
                            <Tooltip
                              title="Group of Seven (G7) & G20 Member State"
                              arrow
                            >
                              <Chip
                                size="small"
                                icon={
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      marginLeft: 3,
                                    }}
                                  >
                                    🏛️
                                  </span>
                                }
                                label="G7"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                                  color: "#a5b4fc",
                                  border: "1px solid rgba(99, 102, 241, 0.45)",
                                  borderRadius: 1,
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                            </Tooltip>
                          )}

                          {country.blocs?.isG20 && !country.blocs?.isG7 && (
                            <Tooltip
                              title="Group of Twenty (G20) Member State"
                              arrow
                            >
                              <Chip
                                size="small"
                                icon={
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      marginLeft: 3,
                                    }}
                                  >
                                    🌐
                                  </span>
                                }
                                label="G20"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  backgroundColor: "rgba(14, 165, 233, 0.2)",
                                  color: "#38bdf8",
                                  border: "1px solid rgba(14, 165, 233, 0.45)",
                                  borderRadius: 1,
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                            </Tooltip>
                          )}

                          {country.blocs?.isG20Guest && (
                            <Tooltip title="G20 Permanent Guest Invitee" arrow>
                              <Chip
                                size="small"
                                icon={
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      marginLeft: 3,
                                    }}
                                  >
                                    🌐
                                  </span>
                                }
                                label="G20 Guest"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                                  color: "#fcd34d",
                                  border: "1px solid rgba(245, 158, 11, 0.45)",
                                  borderRadius: 1,
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Box>

            {/* Infinite Scroll Sentinel & Load More UI */}
            <Box sx={{ mt: 3.5, mb: 2, textAlign: "center" }}>
              {/* Invisible sentinel observed by IntersectionObserver */}
              <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

              {hasMore ? (
                <Stack spacing={1.5} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    sx={{
                      borderRadius: 3,
                      borderColor: "rgba(99, 102, 241, 0.4)",
                      backgroundColor: "rgba(99, 102, 241, 0.08)",
                      color: "primary.light",
                      px: 3,
                      py: 1,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "rgba(99, 102, 241, 0.2)",
                      },
                    }}
                  >
                    Load More Countries ({visibleCountries.length} of{" "}
                    {filteredCountries.length})
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                  >
                    Scroll down to automatically load more
                  </Typography>
                </Stack>
              ) : filteredCountries.length > INITIAL_BATCH_SIZE ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  ✓ Showing all {filteredCountries.length} countries
                </Typography>
              ) : null}
            </Box>
          </Box>
        )}
      </Box>

      {/* Floating Compare Selection Dock */}
      <CompareFloatingDock
        selectedCodes={selectedCompareCodes}
        allCountries={countries}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
      />
    </Container>
  );
}
