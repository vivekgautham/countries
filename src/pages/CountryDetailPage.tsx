import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import MapIcon from "@mui/icons-material/Map";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import { UnifiedCountry } from "../types/country";
import { getCountryEmoji } from "../utils/countryUtils";
import { getNptBadgeConfig } from "../utils/nptUtils";
import { getTaxBadgeConfig } from "../utils/taxUtils";
import { getG7BadgeConfig, getG20BadgeConfig } from "../utils/blocUtils";

export default function CountryDetailPage() {
  const { countryCode = "" } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const { data: countries = [], isLoading } = useCountriesData();

  const [airportSearch, setAirportSearch] = useState("");
  const [showAllAirports, setShowAllAirports] = useState(false);

  // Scroll to top and reset airport state when country changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAirportSearch("");
    setShowAllAirports(false);
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

  const filteredMajorAirports = useMemo(() => {
    if (!country?.airports?.majorAirports) return [];
    const list = country.airports.majorAirports;
    const query = airportSearch.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        (a.iata && a.iata.toLowerCase().includes(query)) ||
        (a.icao && a.icao.toLowerCase().includes(query)) ||
        (a.municipality && a.municipality.toLowerCase().includes(query)),
    );
  }, [country?.airports?.majorAirports, airportSearch]);

  const displayedAirports = useMemo(() => {
    if (airportSearch.trim() || showAllAirports) {
      return filteredMajorAirports;
    }
    return filteredMajorAirports.slice(0, 12);
  }, [filteredMajorAirports, airportSearch, showAllAirports]);

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
  const nptBadge = getNptBadgeConfig(country.npt);
  const taxBadge = getTaxBadgeConfig(country.tax);
  const g7Badge = getG7BadgeConfig();
  const g20Badge = getG20BadgeConfig(country.blocs?.isG20Guest);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Navigation Bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1.5}
        >
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

          <Button
            component={RouterLink}
            to={`/compare?c=${country.code}`}
            startIcon={<CompareArrowsIcon />}
            variant="outlined"
            sx={{
              px: 2.5,
              py: 1,
              borderColor: "rgba(99, 102, 241, 0.5)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "primary.light",
              fontWeight: 700,
              "&:hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.25)",
              },
            }}
          >
            Compare {country.name}
          </Button>
        </Stack>

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

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      gap={0.75}
                    >
                      {country.unMember && (
                        <Chip
                          icon={
                            <VerifiedIcon
                              sx={{ fontSize: "1rem !important" }}
                            />
                          }
                          label="UN Member"
                          color="info"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      )}

                      {country.npt && (
                        <Tooltip title={nptBadge.tooltip} arrow>
                          <Chip
                            icon={
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  marginLeft: "4px",
                                }}
                              >
                                {nptBadge.icon}
                              </span>
                            }
                            label={nptBadge.label}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: nptBadge.backgroundColor,
                              border: `1px solid ${nptBadge.borderColor}`,
                              color: nptBadge.textColor,
                            }}
                          />
                        </Tooltip>
                      )}

                      {country.tax && (
                        <Tooltip title={taxBadge.tooltip} arrow>
                          <Chip
                            icon={
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  marginLeft: "4px",
                                }}
                              >
                                {taxBadge.icon}
                              </span>
                            }
                            label={taxBadge.label}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: taxBadge.backgroundColor,
                              border: `1px solid ${taxBadge.borderColor}`,
                              color: taxBadge.textColor,
                            }}
                          />
                        </Tooltip>
                      )}

                      {country.blocs?.isG7 && (
                        <Tooltip title={g7Badge.tooltip} arrow>
                          <Chip
                            icon={
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  marginLeft: "4px",
                                }}
                              >
                                {g7Badge.icon}
                              </span>
                            }
                            label={g7Badge.label}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: g7Badge.backgroundColor,
                              border: `1px solid ${g7Badge.borderColor}`,
                              color: g7Badge.textColor,
                            }}
                          />
                        </Tooltip>
                      )}

                      {(country.blocs?.isG20 || country.blocs?.isG20Guest) && (
                        <Tooltip title={g20Badge.tooltip} arrow>
                          <Chip
                            icon={
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  marginLeft: "4px",
                                }}
                              >
                                {g20Badge.icon}
                              </span>
                            }
                            label={g20Badge.label}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: g20Badge.backgroundColor,
                              border: `1px solid ${g20Badge.borderColor}`,
                              color: g20Badge.textColor,
                            }}
                          />
                        </Tooltip>
                      )}

                      {country.sovereignty && (
                        <Tooltip
                          title={`Autonomous territory administered under the sovereignty of ${country.sovereignty.sovereignName}`}
                          arrow
                        >
                          <Chip
                            component={RouterLink}
                            to={`/country/${country.sovereignty.sovereignCode.toLowerCase()}`}
                            clickable
                            icon={
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  marginLeft: "4px",
                                }}
                              >
                                👑
                              </span>
                            }
                            label={`Territory of ${country.sovereignty.sovereignName}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: "rgba(99, 102, 241, 0.18)",
                              borderColor: "primary.main",
                              color: "primary.light",
                              "&:hover": {
                                backgroundColor: "rgba(99, 102, 241, 0.3)",
                              },
                            }}
                          />
                        </Tooltip>
                      )}

                      {country.autonomousRegions &&
                        country.autonomousRegions.length > 0 && (
                          <Tooltip
                            title={`Administers ${country.autonomousRegions.length} autonomous regions and overseas territories`}
                            arrow
                          >
                            <Chip
                              icon={
                                <span
                                  style={{
                                    fontSize: "0.95rem",
                                    marginLeft: "4px",
                                  }}
                                >
                                  🏛️
                                </span>
                              }
                              label={`${country.autonomousRegions.length} Autonomous ${country.autonomousRegions.length === 1 ? "Territory" : "Territories"}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 700,
                                backgroundColor: "rgba(236, 72, 153, 0.15)",
                                borderColor: "rgba(236, 72, 153, 0.4)",
                                color: "#f472b6",
                              }}
                            />
                          </Tooltip>
                        )}
                    </Stack>
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
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      👥 Population
                    </Typography>
                    <Typography fontWeight={600}>
                      {country.population
                        ? country.population.toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Stack>
                  {Boolean(
                    country.population && country.area && country.area > 0,
                  ) && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">
                        📊 Population Density
                      </Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {Math.round(
                          country.population / (country.area || 1),
                        ).toLocaleString()}{" "}
                        / sq km (
                        {Math.round(
                          country.population / ((country.area || 1) * 0.386102),
                        ).toLocaleString()}{" "}
                        / sq mi)
                      </Typography>
                    </Stack>
                  )}
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
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      🏛️ G7 Membership
                    </Typography>
                    <Typography fontWeight={600}>
                      {country.blocs?.isG7 ? "Yes (Member State)" : "No"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      🌐 G20 Membership
                    </Typography>
                    <Typography fontWeight={600}>
                      {country.blocs?.isG20
                        ? "Yes (Member State)"
                        : country.blocs?.isG20Guest
                          ? "Permanent Guest Invitee"
                          : "No"}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Nuclear Non-Proliferation Treaty (NPT) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", p: 1 }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    ⚛️ Non-Proliferation Treaty (NPT)
                  </Typography>
                  {country.npt && (
                    <Chip
                      size="small"
                      label={nptBadge.shortLabel}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        backgroundColor: nptBadge.backgroundColor,
                        border: `1px solid ${nptBadge.borderColor}`,
                        color: nptBadge.textColor,
                      }}
                    />
                  )}
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">📋 Status</Typography>
                    <Typography fontWeight={600} textAlign="right">
                      {country.npt?.statusLabel || "Unknown"}
                    </Typography>
                  </Stack>

                  {country.npt?.signedDate && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">✍️ Signed</Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {country.npt.signedDate}
                      </Typography>
                    </Stack>
                  )}

                  {country.npt?.depositedDate && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">
                        📥 Ratified / Deposited
                      </Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {country.npt.depositedDate}
                      </Typography>
                    </Stack>
                  )}

                  {country.npt?.method && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">📜 Method</Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {country.npt.method}
                      </Typography>
                    </Stack>
                  )}

                  {country.npt?.sovereignState && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">
                        👑 Administering State
                      </Typography>
                      <Typography fontWeight={600}>
                        {country.npt.sovereignState}
                      </Typography>
                    </Stack>
                  )}

                  {country.npt?.notes && (
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", lineHeight: 1.5 }}
                      >
                        💡 {country.npt.notes}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      pt: 0.5,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography
                      component="a"
                      href="https://treaties.unoda.org/t/npt"
                      target="_blank"
                      rel="noreferrer"
                      variant="caption"
                      sx={{
                        color: "primary.light",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Source: UNODA Treaty Database ↗
                    </Typography>
                  </Box>
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

          {/* Tax System & Global Income Regime */}
          <Grid size={{ xs: 12 }}>
            <Card
              variant="outlined"
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3.5,
                background:
                  "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)",
                borderColor:
                  country.tax?.systemType === "zero_tax"
                    ? "rgba(16, 185, 129, 0.45)"
                    : country.tax?.systemType === "territorial"
                      ? "rgba(14, 165, 233, 0.45)"
                      : country.tax?.systemType === "non_dom"
                        ? "rgba(168, 85, 247, 0.45)"
                        : "rgba(255, 255, 255, 0.12)",
                boxShadow:
                  country.tax?.systemType === "zero_tax"
                    ? "0 8px 32px rgba(16, 185, 129, 0.12)"
                    : country.tax?.systemType === "territorial"
                      ? "0 8px 32px rgba(14, 165, 233, 0.12)"
                      : "0 8px 32px rgba(0, 0, 0, 0.25)",
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                {/* Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1.5}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span>💰</span> Tax System & Global Income
                    </Typography>
                    {country.tax?.isZeroGlobalTax && (
                      <Chip
                        icon={
                          <span style={{ fontSize: "0.85rem", marginLeft: 4 }}>
                            ✨
                          </span>
                        }
                        label="Zero Global Income Tax"
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          color: "#6ee7b7",
                          border: "1px solid rgba(16, 185, 129, 0.45)",
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.75}>
                    <Chip
                      icon={
                        <span style={{ fontSize: "0.85rem", marginLeft: 4 }}>
                          {taxBadge.icon}
                        </span>
                      }
                      label={country.tax?.systemLabel || taxBadge.label}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        backgroundColor: taxBadge.backgroundColor,
                        border: `1px solid ${taxBadge.borderColor}`,
                        color: taxBadge.textColor,
                      }}
                    />
                    {country.tax?.headlineRate && (
                      <Chip
                        label={`Headline: ${country.tax.headlineRate}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 700,
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          color: "text.primary",
                        }}
                      />
                    )}
                  </Stack>
                </Stack>

                <Divider />

                {/* Summary Banner */}
                {country.tax?.summary && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                      }}
                    >
                      {country.tax.summary}
                    </Typography>
                  </Paper>
                )}

                {/* Rate Statistics Grid */}
                <Grid container spacing={2}>
                  {/* Foreign Income Tax Rate */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        height: "100%",
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderColor: country.tax?.isZeroGlobalTax
                          ? "rgba(16, 185, 129, 0.35)"
                          : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                          }}
                        >
                          🌍 Foreign Income Tax
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: country.tax?.isZeroGlobalTax
                              ? "#6ee7b7"
                              : "text.primary",
                          }}
                        >
                          {country.tax?.foreignIncomeTaxRate ||
                            "Standard Worldwide"}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Domestic Personal Income Tax Rate */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        height: "100%",
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                          }}
                        >
                          💼 Local Income Tax
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color:
                              country.tax?.personalIncomeTaxRate === "0%"
                                ? "#6ee7b7"
                                : "text.primary",
                          }}
                        >
                          {country.tax?.personalIncomeTaxRate ||
                            "Standard Rates"}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Capital Gains Tax Rate */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        height: "100%",
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                          }}
                        >
                          📈 Capital Gains Tax
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>
                          {country.tax?.capitalGainsTaxRate ||
                            "Varies by asset"}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Corporate Tax Rate */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        height: "100%",
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                          }}
                        >
                          🏢 Corporate Tax Rate
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>
                          {country.tax?.corporateTaxRate ||
                            "Standard Corporate Rates"}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Residency Rules and Caveats */}
                <Stack spacing={1.5} sx={{ pt: 0.5 }}>
                  {country.tax?.residencyRule && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      gap={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(30, 41, 59, 0.4)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          minWidth: 160,
                        }}
                      >
                        📅 Tax Residency:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {country.tax.residencyRule}
                      </Typography>
                    </Stack>
                  )}

                  {country.tax?.notes && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      gap={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(30, 41, 59, 0.4)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "warning.light",
                          minWidth: 160,
                        }}
                      >
                        ℹ️ Key Notes & Caveats:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 500 }}
                      >
                        {country.tax.notes}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sovereign Nation & Autonomy (for territories) */}
          {country.sovereignty && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  p: 1,
                  borderColor: "rgba(99, 102, 241, 0.35)",
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                }}
              >
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 700 }}
                    >
                      🏛️ Sovereign Nation & Autonomy
                    </Typography>
                    <Chip
                      size="small"
                      label={country.sovereignty.typeLabel}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                    />
                  </Stack>
                  <Divider />
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">
                        👑 Sovereign Country
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={`/country/${country.sovereignty.sovereignCode.toLowerCase()}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          py: 0.4,
                          px: 1.5,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          borderColor: "primary.main",
                          color: "primary.light",
                          backgroundColor: "rgba(99, 102, 241, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(99, 102, 241, 0.25)",
                            borderColor: "primary.light",
                          },
                        }}
                      >
                        {getCountryEmoji(country.sovereignty.sovereignCode)}{" "}
                        {country.sovereignty.sovereignName} (
                        {country.sovereignty.sovereignCode}) ↗
                      </Button>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography color="text.secondary">
                        📜 Political Classification
                      </Typography>
                      <Typography fontWeight={600} textAlign="right">
                        {country.sovereignty.typeLabel}
                      </Typography>
                    </Stack>

                    {country.sovereignty.notes && (
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", lineHeight: 1.5 }}
                        >
                          💡 {country.sovereignty.notes}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Autonomous Regions & Overseas Territories Grid (for sovereign countries) */}
          {country.autonomousRegions &&
            country.autonomousRegions.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3.5,
                    p: 1,
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    borderColor: "rgba(99, 102, 241, 0.35)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span>🏛️</span> Autonomous Regions & Overseas
                          Territories
                        </Typography>
                        <Chip
                          label={`${country.autonomousRegions.length} ${country.autonomousRegions.length === 1 ? "territory" : "territories"}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Click any region to explore its detailed profile
                      </Typography>
                    </Stack>
                    <Divider />
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                          lg: "repeat(4, 1fr)",
                        },
                        gap: 1.5,
                      }}
                    >
                      {country.autonomousRegions.map((region) => {
                        const flagUrl = `https://flagcdn.com/w80/${region.code.toLowerCase()}.png`;
                        return (
                          <Card
                            key={region.code}
                            variant="outlined"
                            sx={{
                              borderRadius: 2.5,
                              backgroundColor: "rgba(30, 41, 59, 0.6)",
                              borderColor: "rgba(255, 255, 255, 0.1)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: "primary.main",
                                backgroundColor: "rgba(99, 102, 241, 0.12)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                              },
                            }}
                          >
                            <CardActionArea
                              component={RouterLink}
                              to={`/country/${region.code.toLowerCase()}`}
                              sx={{
                                p: 1.5,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 1,
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.25}
                                sx={{ width: "100%" }}
                              >
                                <Box
                                  component="img"
                                  src={flagUrl}
                                  alt=""
                                  sx={{
                                    width: 32,
                                    height: 22,
                                    borderRadius: 0.5,
                                    objectFit: "cover",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.15)",
                                  }}
                                  onError={(
                                    e: React.SyntheticEvent<HTMLImageElement>,
                                  ) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {region.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "primary.light",
                                      fontWeight: 600,
                                    }}
                                  >
                                    ISO: {region.code}
                                  </Typography>
                                </Box>
                              </Stack>

                              <Stack
                                spacing={0.5}
                                sx={{ width: "100%", pt: 0.5 }}
                              >
                                <Chip
                                  size="small"
                                  label={region.typeLabel}
                                  sx={{
                                    height: 20,
                                    fontSize: "0.68rem",
                                    fontWeight: 600,
                                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                                    color: "primary.light",
                                    border: "1px solid rgba(99, 102, 241, 0.3)",
                                    alignSelf: "flex-start",
                                    maxWidth: "100%",
                                    "& .MuiChip-label": { px: 0.5 },
                                  }}
                                />
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{ width: "100%", pt: 0.5 }}
                                >
                                  {region.capital &&
                                    region.capital !== "N/A" && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: "0.72rem" }}
                                      >
                                        🏛️ {region.capital}
                                      </Typography>
                                    )}
                                  {region.population !== undefined &&
                                    region.population > 0 && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: "0.72rem", ml: "auto" }}
                                      >
                                        👥 {region.population.toLocaleString()}
                                      </Typography>
                                    )}
                                </Stack>
                              </Stack>
                            </CardActionArea>
                          </Card>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

          {/* Timezones */}
          {country.timezones && country.timezones.length > 0 && (
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
                      ⏰ Timezones
                    </Typography>
                    <Chip
                      label={`${country.timezones.length} ${country.timezones.length === 1 ? "Zone" : "Zones"}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, height: 22, fontSize: "0.75rem" }}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {country.timezones.map((tz) => (
                      <Chip
                        key={tz}
                        label={tz}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "rgba(15, 23, 42, 0.5)",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
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
                        <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            gap={1.5}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, color: "text.secondary" }}
                            >
                              🛫 Major & Regional Airports (
                              {country.airports.majorAirports.length})
                            </Typography>

                            {country.airports.majorAirports.length > 6 && (
                              <TextField
                                size="small"
                                placeholder="Filter airports / IATA..."
                                value={airportSearch}
                                onChange={(e) =>
                                  setAirportSearch(e.target.value)
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon
                                        fontSize="small"
                                        sx={{ color: "text.secondary" }}
                                      />
                                    </InputAdornment>
                                  ),
                                  endAdornment: airportSearch ? (
                                    <InputAdornment position="end">
                                      <IconButton
                                        size="small"
                                        onClick={() => setAirportSearch("")}
                                        aria-label="Clear filter"
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  ) : null,
                                  sx: {
                                    fontSize: "0.8rem",
                                    height: 32,
                                    borderRadius: 2,
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                  },
                                }}
                                sx={{
                                  width: { xs: "100%", sm: 240 },
                                }}
                              />
                            )}
                          </Stack>

                          {displayedAirports.length === 0 ? (
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 3,
                                textAlign: "center",
                                backgroundColor: "rgba(15, 23, 42, 0.4)",
                                borderRadius: 2,
                                borderStyle: "dashed",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No airports found matching &ldquo;
                                {airportSearch}&rdquo;.
                              </Typography>
                            </Paper>
                          ) : (
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                  xs: "repeat(1, minmax(0, 1fr))",
                                  sm: "repeat(2, minmax(0, 1fr))",
                                  md: "repeat(2, minmax(0, 1fr))",
                                  lg: "repeat(auto-fill, minmax(290px, 1fr))",
                                },
                                gap: 1.25,
                                minWidth: 0,
                              }}
                            >
                              {displayedAirports.map((airport, idx) => (
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
                                    gap: 1.25,
                                    minWidth: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      minWidth: 0,
                                      flexGrow: 1,
                                      overflow: "hidden",
                                    }}
                                  >
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
                                        title={airport.municipality}
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
                                        flexShrink: 0,
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
                                      sx={{
                                        flexShrink: 0,
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  ) : null}
                                </Paper>
                              ))}
                            </Box>
                          )}

                          {!airportSearch.trim() &&
                            filteredMajorAirports.length > 12 && (
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
                                  onClick={() =>
                                    setShowAllAirports((prev) => !prev)
                                  }
                                  endIcon={
                                    showAllAirports ? (
                                      <ExpandLessIcon />
                                    ) : (
                                      <ExpandMoreIcon />
                                    )
                                  }
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    borderColor: "rgba(255, 255, 255, 0.15)",
                                    color: "text.primary",
                                    "&:hover": {
                                      borderColor: "primary.main",
                                      backgroundColor:
                                        "rgba(99, 102, 241, 0.1)",
                                    },
                                  }}
                                >
                                  {showAllAirports
                                    ? "Show fewer airports"
                                    : `Show all ${filteredMajorAirports.length} airports`}
                                </Button>
                              </Box>
                            )}
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1}
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

                  {country.borders && country.borders.length > 0 && (
                    <Button
                      component={RouterLink}
                      to={`/compare?c=${[country.code, ...country.borders.slice(0, 3).map((b) => code3ToCountryMap.get(b)?.code || b)].join(",")}`}
                      startIcon={<CompareArrowsIcon />}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.75rem",
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        "&:hover": { borderColor: "primary.light" },
                      }}
                    >
                      Compare with Neighbors
                    </Button>
                  )}
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
