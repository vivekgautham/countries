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
import React, { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import CompareFloatingDock from "../components/compare/CompareFloatingDock";
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

const MAX_COMPARE_COUNTRIES = 4;

export default function CountryListPage() {
  const { data: countries = [], isLoading, isError } = useCountriesData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCompareCodes, setSelectedCompareCodes] = useState<string[]>(
    [],
  );

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
  }, [countries, searchTerm, selectedRegion]);

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
                }}
              >
                Reset Filters
              </Button>
            </Stack>
          </Paper>
        ) : (
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
            {filteredCountries.map((country) => {
              const codeLower = country.code.toLowerCase();
              const flagUrl = `https://flagcdn.com/w320/${codeLower}.png`;
              const isCompared = selectedCompareCodes.includes(
                country.code.toUpperCase(),
              );

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
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
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
