import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import MapIcon from "@mui/icons-material/Map";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "rgba(30, 41, 59, 0.3)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress color="primary" />
            <Typography color="text.secondary">
              Loading country details...
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!country) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              Back to all countries
            </Button>
          </Box>

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
              <ExploreIcon sx={{ fontSize: 64, color: "text.secondary" }} />
              <Typography variant="h4" component="h2">
                Country Not Found
              </Typography>
              <Typography color="text.secondary">
                We couldn&apos;t find a country matching &ldquo;{countryCode}
                &rdquo;.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/")}>
                Explore Countries
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  const codeLower = country.code.toLowerCase();
  const flagUrl = `https://flagcdn.com/w640/${codeLower}.png`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name)}`;
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name)}`;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Navigation Bar */}
        <Box>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              px: 2.5,
              py: 1,
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
              },
            }}
          >
            Back to all countries
          </Button>
        </Box>

        {/* Hero Card */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
          }}
        >
          <Grid container>
            {/* Flag & Coat of Arms Showcase */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                position: "relative",
                backgroundColor: "#020617",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 240,
                p: 3,
                borderRight: { md: "1px solid rgba(255, 255, 255, 0.08)" },
                borderBottom: {
                  xs: "1px solid rgba(255, 255, 255, 0.08)",
                  md: "none",
                },
              }}
            >
              <Box
                component="img"
                src={flagUrl}
                alt={`Flag of ${country.name}`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {country.coatOfArms && (
                <Paper
                  variant="outlined"
                  title="Official Coat of Arms"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    width: 60,
                    height: 60,
                    p: 0.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={country.coatOfArms}
                    alt={`Coat of arms of ${country.name}`}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Paper>
              )}
            </Grid>

            {/* Hero Main Info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <CardContent
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <span>{getCountryEmoji(country.code)}</span>
                      {country.name}
                    </Typography>

                    {country.unMember && (
                      <Chip
                        icon={
                          <VerifiedIcon sx={{ fontSize: "1rem !important" }} />
                        }
                        label="UN Member"
                        color="info"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Stack>

                  {country.officialName &&
                    country.officialName !== country.name && (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {country.officialName}
                      </Typography>
                    )}

                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ pt: 0.5 }}
                  >
                    <Chip
                      label={country.region}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {country.subregion && (
                      <Chip
                        label={country.subregion}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`ISO: ${country.code}${country.code3 ? ` / ${country.code3}` : ""}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                {/* Action Links */}
                <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ pt: 1 }}>
                  <Button
                    component="a"
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    color="success"
                    startIcon={<MapIcon />}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "#6ee7b7",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      "&:hover": {
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                      },
                    }}
                  >
                    View on Google Maps ↗
                  </Button>
                  <Button
                    component="a"
                    href={wikipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    startIcon={<MenuBookIcon />}
                    size="small"
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "text.primary",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    Wikipedia Article ↗
                  </Button>
                </Stack>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* Detailed Info Cards Grid */}
        <Grid container spacing={2.5}>
          {/* Geography & Territory */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  🌍 Geography & Territory
                </Typography>
                <Divider />
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">🏛️ Capital</Typography>
                    <Typography fontWeight={600}>
                      {country.capital || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">📍 Region</Typography>
                    <Typography fontWeight={600}>{country.region}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">🧭 Subregion</Typography>
                    <Typography fontWeight={600}>
                      {country.subregion || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      📐 Total Area
                    </Typography>
                    <Typography fontWeight={600} textAlign="right">
                      {country.area
                        ? `${country.area.toLocaleString()} sq km (${(country.area * 0.386102).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq mi)`
                        : "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Identity & Codes */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  🔤 Identity & Codes
                </Typography>
                <Divider />
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      🔤 ISO Alpha-2
                    </Typography>
                    <Typography fontWeight={600}>{country.code}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      🔤 ISO Alpha-3
                    </Typography>
                    <Typography fontWeight={600}>
                      {country.code3 || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      📞 Calling Code
                    </Typography>
                    <Typography fontWeight={600}>
                      {country.phoneCode || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Currencies */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  💵 Currencies
                </Typography>
                <Divider />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {country.currencies && country.currencies.length > 0 ? (
                    country.currencies.map((curr) => (
                      <Chip
                        key={curr}
                        label={curr}
                        color="success"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "rgba(16, 185, 129, 0.12)",
                          borderColor: "rgba(16, 185, 129, 0.3)",
                          color: "#6ee7b7",
                        }}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">N/A</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Spoken Languages */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    🗣️ Spoken Languages
                  </Typography>
                  <Chip
                    label={country.languages ? country.languages.length : 0}
                    size="small"
                    color={
                      country.languages && country.languages.length > 0
                        ? "secondary"
                        : "default"
                    }
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      height: 22,
                      fontSize: "0.75rem",
                    }}
                  />
                </Stack>
                <Divider />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {country.languages && country.languages.length > 0 ? (
                    country.languages.map((lang) => (
                      <Chip
                        key={lang}
                        label={lang}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(168, 85, 247, 0.15)",
                          color: "#e9d5ff",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                        }}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">N/A</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Timezones */}
          {country.timezones && country.timezones.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    ⏰ Timezones
                  </Typography>
                  <Divider />
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {country.timezones.map((tz) => (
                      <Chip
                        key={tz}
                        label={tz}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Aviation & Airports */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FlightTakeoffIcon sx={{ color: "primary.main" }} />
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 700 }}
                    >
                      Aviation & Airports
                    </Typography>
                    {country.airports && (
                      <Chip
                        label={`${country.airports.active.toLocaleString()} Active`}
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
                  </Stack>
                  <Typography
                    component="a"
                    href="https://davidmegginson.github.io/ourairports-data/"
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
                    Source: OurAirports Data ↗
                  </Typography>
                </Stack>
                <Divider />

                {country.airports && country.airports.total > 0 ? (
                  <Stack spacing={3}>
                    {/* Stats Grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                          md: "repeat(6, 1fr)",
                        },
                        gap: 1.5,
                      }}
                    >
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "primary.light" }}
                        >
                          {country.airports.active.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Active
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#38bdf8" }}
                        >
                          {country.airports.large.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Large Hubs
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#a855f7" }}
                        >
                          {country.airports.medium.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Medium / Regional
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#94a3b8" }}
                        >
                          {country.airports.small.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Small Airfields
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#f59e0b" }}
                        >
                          {country.airports.heliport.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Heliports
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#10b981" }}
                        >
                          {country.airports.scheduled.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Scheduled Routes
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Major Airports List */}
                    {country.airports.majorAirports &&
                      country.airports.majorAirports.length > 0 && (
                        <Stack spacing={1.5}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                          >
                            🛫 Major & Regional Airports (
                            {country.airports.majorAirports.length})
                          </Typography>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                              },
                              gap: 1.25,
                            }}
                          >
                            {country.airports.majorAirports.map(
                              (airport, idx) => (
                                <Paper
                                  key={`${airport.name}-${idx}`}
                                  variant="outlined"
                                  sx={{
                                    p: 1.25,
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                    borderColor: "rgba(255, 255, 255, 0.08)",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                  }}
                                >
                                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={airport.name}
                                    >
                                      {airport.name}
                                    </Typography>
                                    {airport.municipality && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          display: "block",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        📍 {airport.municipality}
                                      </Typography>
                                    )}
                                  </Box>
                                  {airport.iata ? (
                                    <Chip
                                      label={airport.iata}
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        backgroundColor:
                                          airport.type === "large_airport"
                                            ? "rgba(99, 102, 241, 0.25)"
                                            : "rgba(148, 163, 184, 0.15)",
                                        color:
                                          airport.type === "large_airport"
                                            ? "primary.light"
                                            : "text.secondary",
                                        border: "1px solid",
                                        borderColor:
                                          airport.type === "large_airport"
                                            ? "rgba(99, 102, 241, 0.4)"
                                            : "rgba(255, 255, 255, 0.1)",
                                      }}
                                    />
                                  ) : airport.icao ? (
                                    <Chip
                                      label={airport.icao}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: "0.7rem" }}
                                    />
                                  ) : null}
                                </Paper>
                              ),
                            )}
                          </Box>
                        </Stack>
                      )}
                  </Stack>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ fontStyle: "italic", fontSize: "0.9rem" }}
                  >
                    No commercial airports or registered airfields recorded for
                    this territory.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Bordering Nations */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    🗺️ Bordering Nations
                  </Typography>
                  <Chip
                    label={country.borders ? country.borders.length : 0}
                    size="small"
                    color={
                      country.borders && country.borders.length > 0
                        ? "primary"
                        : "default"
                    }
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      height: 22,
                      fontSize: "0.75rem",
                    }}
                  />
                </Stack>
                <Divider />
                {country.borders && country.borders.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                      },
                      gap: 1.5,
                    }}
                  >
                    {country.borders.map((bCode) => {
                      const neighbor = code3ToCountryMap.get(
                        bCode.toUpperCase(),
                      );
                      if (neighbor) {
                        return (
                          <Button
                            key={bCode}
                            component={RouterLink}
                            to={`/country/${neighbor.code.toLowerCase()}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              justifyContent: "flex-start",
                              p: 1,
                              backgroundColor: "rgba(15, 23, 42, 0.6)",
                              borderColor: "rgba(255, 255, 255, 0.1)",
                              "&:hover": {
                                borderColor: "primary.main",
                                backgroundColor: "rgba(99, 102, 241, 0.15)",
                              },
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{ width: "100%", overflow: "hidden" }}
                            >
                              <Typography
                                sx={{ fontSize: "1.2rem", lineHeight: 1 }}
                              >
                                {getCountryEmoji(neighbor.code)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  flexGrow: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  textAlign: "left",
                                }}
                              >
                                {neighbor.name}
                              </Typography>
                              <Chip
                                label={neighbor.code}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                            </Stack>
                          </Button>
                        );
                      }
                      return (
                        <Chip
                          key={bCode}
                          label={bCode}
                          variant="outlined"
                          size="small"
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ fontStyle: "italic", fontSize: "0.9rem" }}
                  >
                    None (Island or territory with no land borders)
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
