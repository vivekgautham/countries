import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationCityIcon from "@mui/icons-material/LocationCity";
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
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { CityInfo, UnifiedCountry } from "../../types/country";

interface LargestCitiesSectionProps {
  country: UnifiedCountry;
}

export const LargestCitiesSection: React.FC<LargestCitiesSectionProps> = ({
  country,
}) => {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Sort alphabetically by city name
  const sortedCities = useMemo(() => {
    return [...(country.cities || [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [country.cities]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedCities;
    return sortedCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.adminName && c.adminName.toLowerCase().includes(q)),
    );
  }, [sortedCities, search]);

  const displayedCities = useMemo(() => {
    if (search.trim() || showAll) {
      return filteredCities;
    }
    return filteredCities.slice(0, 8);
  }, [filteredCities, search, showAll]);

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            <LocationCityIcon sx={{ color: "primary.main", fontSize: 24 }} />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              Major Cities
            </Typography>

            {sortedCities.length > 0 && (
              <Chip
                label={`${sortedCities.length} ${sortedCities.length === 1 ? "City" : "Cities"}`}
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

            {country.capital && country.capital !== "N/A" && (
              <Chip
                label={`🏛️ Capital: ${country.capital}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
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

        {sortedCities.length > 0 ? (
          <Stack spacing={2}>
            {/* Filter Input */}
            {sortedCities.length > 6 && (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Search ${sortedCities.length} cities by name or state/province...`}
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
                    maxWidth: { xs: "100%", sm: 380 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                    },
                  }}
                />
              </Box>
            )}

            {/* City & State Grid */}
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
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.25,
                }}
              >
                {displayedCities.map((city: CityInfo) => (
                  <Paper
                    key={city.name}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(30, 41, 59, 0.3)",
                      borderColor: city.isCapital
                        ? "rgba(99, 102, 241, 0.4)"
                        : "rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 0.5,
                      transition:
                        "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        borderColor: "rgba(99, 102, 241, 0.6)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: "0.95rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {city.name}
                      </Typography>

                      {city.isCapital && (
                        <Chip
                          label="Capital"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(99, 102, 241, 0.2)",
                            color: "#a5b4fc",
                            border: "1px solid rgba(99, 102, 241, 0.4)",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: 18,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Stack>

                    {city.adminName && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          fontSize: "0.8rem",
                        }}
                      >
                        📍 {city.adminName}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            )}

            {/* Show All / Show Fewer Toggle */}
            {!search.trim() && filteredCities.length > 8 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 0.5,
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
                    : `Show all ${filteredCities.length} cities`}
                </Button>
              </Box>
            )}
          </Stack>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
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
              No major cities recorded for this territory.
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
