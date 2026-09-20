import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useCountriesData } from "../api/countriesApi";
import AppVersionBadge from "../components/layout/AppVersionBadge";
import { BLOC_FILTER_OPTIONS, matchesBlocFilter } from "../utils/blocUtils";
import { getCountryEmoji } from "../utils/countryUtils";
import {
  getTaxBadgeConfig,
  matchesTaxFilter,
  TAX_FILTER_OPTIONS,
} from "../utils/taxUtils";

const REGION_OPTIONS = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

export default function TaxAtlasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: countries = [], isLoading, isError } = useCountriesData();

  // Active Tab from URL params or default to 'zero_global' or 'all'
  const activeTab = searchParams.get("tab") || "all";
  const activeBloc = searchParams.get("bloc") || "all";

  // Local state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copyToast, setCopyToast] = useState<boolean>(false);

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newTab: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", newTab);
    if (newTab !== "blocs") {
      nextParams.delete("bloc");
    }
    setSearchParams(nextParams);
  };

  // Bloc sub-filter handler
  const handleBlocChange = (blocId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "blocs");
    nextParams.set("bloc", blocId);
    setSearchParams(nextParams);
  };

  // Share link handler
  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
    }
  };

  // KPI Statistics
  const kpiStats = useMemo(() => {
    let zeroTaxCount = 0;
    let territorialCount = 0;
    let nonDomCount = 0;
    let blocsRepresented = 0;

    countries.forEach((c) => {
      const type = c.tax?.systemType;
      if (type === "zero_tax") zeroTaxCount++;
      else if (type === "territorial") territorialCount++;
      else if (type === "non_dom") nonDomCount++;

      const b = c.blocs;
      if (
        b &&
        (b.isEU ||
          b.isNATO ||
          b.isBRICS ||
          b.isG7 ||
          b.isG20 ||
          b.isGCC ||
          b.isSchengen ||
          b.isEurozone)
      ) {
        blocsRepresented++;
      }
    });

    return {
      zeroTaxCount,
      territorialCount,
      nonDomCount,
      blocsRepresented,
    };
  }, [countries]);

  // Filtered Countries
  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // 1. Tab Filter
    if (activeTab === "blocs") {
      if (activeBloc !== "all") {
        result = result.filter((c) => matchesBlocFilter(c, activeBloc));
      } else {
        // Show all countries with at least one bloc membership
        result = result.filter((c) => {
          const b = c.blocs;
          return (
            b &&
            (b.isEU ||
              b.isNATO ||
              b.isBRICS ||
              b.isG7 ||
              b.isG20 ||
              b.isGCC ||
              b.isSchengen ||
              b.isEurozone)
          );
        });
      }
    } else if (activeTab !== "all") {
      result = result.filter((c) => matchesTaxFilter(c, activeTab));
    }

    // 2. Region Filter
    if (selectedRegion !== "All") {
      result = result.filter(
        (c) => c.region.toLowerCase() === selectedRegion.toLowerCase(),
      );
    }

    // 3. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((c) => {
        const tax = c.tax;
        return (
          c.name.toLowerCase().includes(q) ||
          c.officialName?.toLowerCase().includes(q) ||
          c.code.toLowerCase() === q ||
          (c.code3 && c.code3.toLowerCase() === q) ||
          c.capital?.toLowerCase().includes(q) ||
          tax?.systemLabel.toLowerCase().includes(q) ||
          tax?.summary?.toLowerCase().includes(q) ||
          tax?.notes?.toLowerCase().includes(q) ||
          tax?.residencyRule?.toLowerCase().includes(q)
        );
      });
    }

    // Prioritize 0% and territorial taxes first in 'all' view, then alphabetical
    result.sort((a, b) => {
      const priority = (sys?: string) => {
        if (sys === "zero_tax") return 1;
        if (sys === "territorial") return 2;
        if (sys === "non_dom") return 3;
        return 4;
      };
      const diff = priority(a.tax?.systemType) - priority(b.tax?.systemType);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [countries, activeTab, activeBloc, selectedRegion, searchTerm]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: "center" }}>
        <CircularProgress size={48} sx={{ color: "secondary.light", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Compiling global tax regimes and geopolitical blocs...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load tax atlas data. Please verify your connection or try
          again later.
        </Alert>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Return to Explorer
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 1680,
        py: { xs: 2.5, sm: 4 },
        px: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Top Header Bar: Back navigation, rankings, version, share */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "text.secondary",
              "&:hover": {
                borderColor: "primary.light",
                color: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            Explorer
          </Button>

          <Button
            component={RouterLink}
            to="/rankings"
            startIcon={<EmojiEventsIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(245, 158, 11, 0.35)",
              backgroundColor: "rgba(245, 158, 11, 0.06)",
              color: "#fbbf24",
              "&:hover": {
                borderColor: "#fbbf24",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
              },
            }}
          >
            Rankings
          </Button>

          <Button
            component={RouterLink}
            to="/compare"
            startIcon={<CompareArrowsIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(99, 102, 241, 0.3)",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
              color: "primary.light",
              "&:hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(99, 102, 241, 0.16)",
              },
            }}
          >
            Compare
          </Button>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Copy shareable link to Tax Atlas" arrow>
            <IconButton
              onClick={handleShareLink}
              size="small"
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "text.secondary",
                "&:hover": {
                  color: "secondary.light",
                  borderColor: "secondary.light",
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                },
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <AppVersionBadge compact />
        </Stack>
      </Box>

      {/* Hero Title Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.85rem", sm: "2.6rem" },
            mb: 1.2,
          }}
        >
          <Box component="span" sx={{ mr: 1.2 }}>
            🏛️
          </Box>
          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tax Atlas
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 780,
            mx: "auto",
            fontSize: { xs: "0.88rem", sm: "1.02rem" },
            lineHeight: 1.5,
          }}
        >
          Global guide to national tax systems, pure zero-tax havens,
          territorial exemptions, expat non-domicile regimes, and geopolitical
          alliances.
        </Typography>
      </Box>

      {/* Executive KPI Stat Summary */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() =>
              handleTabChange({} as React.SyntheticEvent, "zero_tax")
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                borderColor: "rgba(16, 185, 129, 0.6)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6ee7b7", fontWeight: 700 }}
                  >
                    PURE 0% TAX HAVENS
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#6ee7b7", mt: 0.5 }}
                  >
                    {kpiStats.zeroTaxCount}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "2rem" }}>🟢</Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 1, display: "block" }}
              >
                0% PIT on domestic and global income
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() =>
              handleTabChange({} as React.SyntheticEvent, "territorial")
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              backgroundColor: "rgba(14, 165, 233, 0.08)",
              border: "1px solid rgba(14, 165, 233, 0.25)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                borderColor: "rgba(14, 165, 233, 0.6)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#38bdf8", fontWeight: 700 }}
                  >
                    TERRITORIAL TAX
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#38bdf8", mt: 0.5 }}
                  >
                    {kpiStats.territorialCount}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "2rem" }}>🔵</Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 1, display: "block" }}
              >
                0% tax on foreign-sourced income
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() =>
              handleTabChange({} as React.SyntheticEvent, "non_dom")
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              backgroundColor: "rgba(168, 85, 247, 0.08)",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                borderColor: "rgba(168, 85, 247, 0.6)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#c084fc", fontWeight: 700 }}
                  >
                    NON-DOM & SPECIAL
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#c084fc", mt: 0.5 }}
                  >
                    {kpiStats.nonDomCount}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "2rem" }}>🟣</Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 1, display: "block" }}
              >
                Lump-sum & expat remittance relief
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() => handleTabChange({} as React.SyntheticEvent, "blocs")}
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                borderColor: "rgba(245, 158, 11, 0.6)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#fcd34d", fontWeight: 700 }}
                  >
                    REGIONAL BLOCS
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#fcd34d", mt: 0.5 }}
                  >
                    {kpiStats.blocsRepresented}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "2rem" }}>🏛️</Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 1, display: "block" }}
              >
                EU, NATO, BRICS, G7, G20, GCC
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Tabs (No Underline) */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          p: 0.8,
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", sm: "0.92rem" },
              minHeight: 46,
              borderRadius: 2.5,
              px: { xs: 1.8, sm: 2.5 },
              transition: "all 0.2s ease",
              color: "text.secondary",
              border: "1px solid transparent",
              "&.Mui-selected": {
                color: "secondary.light",
                backgroundColor: "rgba(168, 85, 247, 0.16)",
                borderColor: "rgba(168, 85, 247, 0.35)",
                boxShadow: "0 2px 10px rgba(168, 85, 247, 0.12)",
              },
              "&:hover:not(.Mui-selected)": {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: "text.primary",
              },
            },
          }}
        >
          {TAX_FILTER_OPTIONS.map((opt) => (
            <Tab
              key={opt.id}
              value={opt.id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </Stack>
              }
            />
          ))}
          <Tab
            value="blocs"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>🏛️</span>
                <span>Regional Blocs</span>
              </Stack>
            }
          />
        </Tabs>
      </Paper>

      {/* Sub-Pills for Blocs (Shown when Blocs tab is active) */}
      {activeTab === "blocs" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mr: 0.5,
            }}
          >
            Bloc:
          </Typography>
          {BLOC_FILTER_OPTIONS.map((bloc) => {
            const isSelected = activeBloc === bloc.id;
            return (
              <Chip
                key={bloc.id}
                icon={<span style={{ marginLeft: 4 }}>{bloc.icon}</span>}
                label={bloc.label}
                clickable
                onClick={() => handleBlocChange(bloc.id)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  borderRadius: 2.5,
                  fontSize: "0.82rem",
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected
                    ? "rgba(245, 158, 11, 0.25)"
                    : "rgba(30, 41, 59, 0.3)",
                  borderColor: isSelected
                    ? "rgba(245, 158, 11, 0.6)"
                    : "rgba(255, 255, 255, 0.08)",
                  color: isSelected ? "#fcd34d" : "text.secondary",
                  "&:hover": {
                    borderColor: "#fcd34d",
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* Filter and View Controls */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          p: { xs: 2, sm: 2.5 },
          mb: 3.5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          {/* Search bar */}
          <TextField
            size="small"
            placeholder="Search tax rules, golden visas, residency rules, countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    sx={{ color: "text.secondary" }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              maxWidth: { md: 420 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "rgba(15, 23, 42, 0.4)",
              },
            }}
          />

          {/* Region Filter & View Toggle */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {/* Region Filter */}
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {REGION_OPTIONS.map((region) => (
                <Chip
                  key={region}
                  label={region}
                  size="small"
                  clickable
                  onClick={() => setSelectedRegion(region)}
                  variant={selectedRegion === region ? "filled" : "outlined"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: selectedRegion === region ? 700 : 500,
                    fontSize: "0.78rem",
                    backgroundColor:
                      selectedRegion === region
                        ? "secondary.main"
                        : "rgba(255, 255, 255, 0.04)",
                    borderColor:
                      selectedRegion === region
                        ? "secondary.main"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                />
              ))}
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                display: { xs: "none", sm: "block" },
              }}
            />

            {/* View Mode Toggle */}
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Card Grid View" arrow>
                <IconButton
                  size="small"
                  onClick={() => setViewMode("grid")}
                  sx={{
                    border: "1px solid",
                    borderColor:
                      viewMode === "grid"
                        ? "secondary.light"
                        : "rgba(255, 255, 255, 0.12)",
                    backgroundColor:
                      viewMode === "grid"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "transparent",
                    color:
                      viewMode === "grid"
                        ? "secondary.light"
                        : "text.secondary",
                  }}
                >
                  <ViewModuleIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Table View" arrow>
                <IconButton
                  size="small"
                  onClick={() => setViewMode("table")}
                  sx={{
                    border: "1px solid",
                    borderColor:
                      viewMode === "table"
                        ? "secondary.light"
                        : "rgba(255, 255, 255, 0.12)",
                    backgroundColor:
                      viewMode === "table"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "transparent",
                    color:
                      viewMode === "table"
                        ? "secondary.light"
                        : "text.secondary",
                  }}
                >
                  <TableRowsIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        {/* Live Filter Count */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Showing <strong>{filteredCountries.length}</strong> matching tax
            jurisdictions
          </Typography>

          {(searchTerm || selectedRegion !== "All") && (
            <Button
              size="small"
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("All");
              }}
              sx={{
                fontSize: "0.74rem",
                textTransform: "none",
                color: "secondary.light",
              }}
            >
              Reset filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* View: Grid Cards */}
      {viewMode === "grid" ? (
        filteredCountries.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3.5,
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
              No countries match your search or filter criteria.
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Try loosening your search query or selecting &quot;All&quot;
              regions.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5} sx={{ mb: 6 }}>
            {filteredCountries.map((country) => {
              const tax = country.tax;
              const badge = getTaxBadgeConfig(tax);
              const b = country.blocs;

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={country.code}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3.5,
                      backgroundColor: "rgba(30, 41, 59, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(12px)",
                      transition:
                        "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: badge.borderColor,
                        boxShadow: `0 8px 24px -8px ${badge.backgroundColor}`,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 2.5,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header: Flag, Name, Code, Tax Badge */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1.5}
                        sx={{ mb: 2 }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box sx={{ fontSize: "2rem", lineHeight: 1 }}>
                            {getCountryEmoji(country.code)}
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                color: "text.primary",
                                lineHeight: 1.2,
                              }}
                            >
                              {country.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {country.region} • {country.code}
                              {country.capital ? ` • ${country.capital}` : ""}
                            </Typography>
                          </Box>
                        </Stack>

                        <Tooltip title={badge.tooltip} arrow>
                          <Chip
                            icon={
                              <span
                                style={{ fontSize: "0.85rem", marginLeft: 4 }}
                              >
                                {badge.icon}
                              </span>
                            }
                            label={badge.shortLabel}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.72rem",
                              backgroundColor: badge.backgroundColor,
                              color: badge.textColor,
                              border: `1px solid ${badge.borderColor}`,
                              borderRadius: 2,
                            }}
                          />
                        </Tooltip>
                      </Stack>

                      {/* Tax Rates Grid */}
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          backgroundColor: "rgba(15, 23, 42, 0.45)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          mb: 2,
                        }}
                      >
                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 6 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              Personal PIT Rate
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 800,
                                color:
                                  tax?.systemType === "zero_tax"
                                    ? "#6ee7b7"
                                    : "text.primary",
                                fontSize: "0.88rem",
                              }}
                            >
                              {tax?.headlineRate || "Standard"}
                            </Typography>
                          </Grid>

                          <Grid size={{ xs: 6 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              Foreign Income
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 800,
                                color:
                                  tax?.isZeroGlobalTax ||
                                  tax?.systemType === "territorial" ||
                                  tax?.systemType === "zero_tax"
                                    ? "#38bdf8"
                                    : "text.primary",
                                fontSize: "0.88rem",
                              }}
                            >
                              {tax?.foreignIncomeTaxRate || "Worldwide"}
                            </Typography>
                          </Grid>

                          {tax?.corporateTaxRate && (
                            <Grid size={{ xs: 12 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                }}
                              >
                                Corporate Tax
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  fontSize: "0.82rem",
                                  lineHeight: 1.3,
                                }}
                              >
                                {tax.corporateTaxRate}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>

                      {/* Residency Rule */}
                      {tax?.residencyRule && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              fontSize: "0.7rem",
                              display: "block",
                              mb: 0.25,
                            }}
                          >
                            Residency Rule
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.8rem",
                              color: "text.secondary",
                              lineHeight: 1.35,
                            }}
                          >
                            {tax.residencyRule}
                          </Typography>
                        </Box>
                      )}

                      {/* Summary Notes */}
                      {tax?.summary && (
                        <Box sx={{ mb: 2, flexGrow: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {tax.summary}
                          </Typography>
                        </Box>
                      )}

                      {/* Blocs Chips */}
                      {b && (
                        <Stack
                          direction="row"
                          spacing={0.6}
                          flexWrap="wrap"
                          gap={0.6}
                          sx={{ mb: 2 }}
                        >
                          {b.isEU && (
                            <Chip
                              label="🇪🇺 EU"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(59, 130, 246, 0.15)",
                                color: "#93c5fd",
                              }}
                            />
                          )}
                          {b.isSchengen && (
                            <Chip
                              label="🛂 Schengen"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(6, 182, 212, 0.15)",
                                color: "#67e8f9",
                              }}
                            />
                          )}
                          {b.isEurozone && (
                            <Chip
                              label="💶 Eurozone"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(16, 185, 129, 0.15)",
                                color: "#6ee7b7",
                              }}
                            />
                          )}
                          {b.isNATO && (
                            <Chip
                              label="🛡️ NATO"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(99, 102, 241, 0.15)",
                                color: "#a5b4fc",
                              }}
                            />
                          )}
                          {b.isBRICS && (
                            <Chip
                              label="🪙 BRICS+"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(245, 158, 11, 0.15)",
                                color: "#fcd34d",
                              }}
                            />
                          )}
                          {b.isG7 && (
                            <Chip
                              label="🏛️ G7"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(99, 102, 241, 0.15)",
                                color: "#a5b4fc",
                              }}
                            />
                          )}
                          {b.isG20 && (
                            <Chip
                              label="🌐 G20"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(245, 158, 11, 0.15)",
                                color: "#fcd34d",
                              }}
                            />
                          )}
                          {b.isGCC && (
                            <Chip
                              label="🌴 GCC"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(16, 185, 129, 0.15)",
                                color: "#6ee7b7",
                              }}
                            />
                          )}
                        </Stack>
                      )}

                      <Divider
                        sx={{
                          borderColor: "rgba(255, 255, 255, 0.06)",
                          mb: 1.5,
                        }}
                      />

                      {/* Card Action Buttons */}
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <Button
                          component={RouterLink}
                          to={`/compare?c=${country.code}`}
                          size="small"
                          startIcon={<CompareArrowsIcon />}
                          sx={{
                            fontSize: "0.75rem",
                            textTransform: "none",
                            color: "text.secondary",
                            "&:hover": { color: "primary.light" },
                          }}
                        >
                          Compare
                        </Button>

                        <Button
                          component={RouterLink}
                          to={`/country/${country.code}`}
                          size="small"
                          endIcon={<OpenInNewIcon />}
                          variant="outlined"
                          sx={{
                            fontSize: "0.75rem",
                            textTransform: "none",
                            borderRadius: 2,
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            color: "text.primary",
                            "&:hover": {
                              borderColor: "secondary.light",
                              backgroundColor: "rgba(168, 85, 247, 0.1)",
                            },
                          }}
                        >
                          Profile
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )
      ) : (
        /* View: Table View */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3.5,
            backgroundColor: "rgba(30, 41, 59, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            mb: 6,
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  "& th": {
                    fontWeight: 700,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    py: 1.8,
                  },
                }}
              >
                <TableCell>Country</TableCell>
                <TableCell>Tax Regime</TableCell>
                <TableCell>PIT Headline Rate</TableCell>
                <TableCell>Foreign Income</TableCell>
                <TableCell>Corporate Tax</TableCell>
                <TableCell>Blocs</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCountries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      borderBottom: "none",
                      color: "text.secondary",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1.05rem" }}
                    >
                      No tax jurisdictions match your current filter.
                    </Typography>
                    <Typography variant="body2">
                      Try loosening your search query or selecting
                      &quot;All&quot; regions.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCountries.map((country) => {
                  const tax = country.tax;
                  const badge = getTaxBadgeConfig(tax);
                  const b = country.blocs;

                  return (
                    <TableRow
                      key={country.code}
                      hover
                      sx={{
                        transition: "background-color 0.15s ease",
                        "&:hover": {
                          backgroundColor:
                            "rgba(168, 85, 247, 0.08) !important",
                        },
                        "& td": {
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          py: 1.6,
                        },
                      }}
                    >
                      {/* Country */}
                      <TableCell>
                        <RouterLink
                          to={`/country/${country.code}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <Box sx={{ fontSize: "1.6rem", lineHeight: 1 }}>
                            {getCountryEmoji(country.code)}
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                "&:hover": { color: "secondary.light" },
                              }}
                            >
                              {country.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {country.region} • {country.code}
                            </Typography>
                          </Box>
                        </RouterLink>
                      </TableCell>

                      {/* Tax Regime */}
                      <TableCell>
                        <Chip
                          icon={
                            <span
                              style={{ fontSize: "0.85rem", marginLeft: 4 }}
                            >
                              {badge.icon}
                            </span>
                          }
                          label={badge.shortLabel}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.74rem",
                            backgroundColor: badge.backgroundColor,
                            color: badge.textColor,
                            border: `1px solid ${badge.borderColor}`,
                          }}
                        />
                      </TableCell>

                      {/* Headline PIT */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color:
                              tax?.systemType === "zero_tax"
                                ? "#6ee7b7"
                                : "text.primary",
                            fontSize: "0.85rem",
                          }}
                        >
                          {tax?.headlineRate || "Standard"}
                        </Typography>
                      </TableCell>

                      {/* Foreign Income */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color:
                              tax?.isZeroGlobalTax ||
                              tax?.systemType === "territorial" ||
                              tax?.systemType === "zero_tax"
                                ? "#38bdf8"
                                : "text.secondary",
                            fontSize: "0.85rem",
                          }}
                        >
                          {tax?.foreignIncomeTaxRate || "Worldwide"}
                        </Typography>
                      </TableCell>

                      {/* Corporate Tax */}
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.8rem",
                            maxWidth: 180,
                            display: "block",
                          }}
                        >
                          {tax?.corporateTaxRate || "Standard"}
                        </Typography>
                      </TableCell>

                      {/* Blocs */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          gap={0.5}
                        >
                          {b?.isEU && (
                            <Chip
                              label="EU"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {b?.isNATO && (
                            <Chip
                              label="NATO"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {b?.isBRICS && (
                            <Chip
                              label="BRICS+"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {b?.isG7 && (
                            <Chip
                              label="G7"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {b?.isG20 && (
                            <Chip
                              label="G20"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {b?.isGCC && (
                            <Chip
                              label="GCC"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                          {!b?.isEU &&
                            !b?.isNATO &&
                            !b?.isBRICS &&
                            !b?.isG7 &&
                            !b?.isG20 &&
                            !b?.isGCC && (
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                —
                              </Typography>
                            )}
                        </Stack>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Compare this country" arrow>
                            <IconButton
                              component={RouterLink}
                              to={`/compare?c=${country.code}`}
                              size="small"
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "secondary.light",
                                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                                },
                              }}
                            >
                              <CompareArrowsIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View country profile" arrow>
                            <IconButton
                              component={RouterLink}
                              to={`/country/${country.code}`}
                              size="small"
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "secondary.light",
                                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                                },
                              }}
                            >
                              <OpenInNewIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Share Toast */}
      <Snackbar
        open={copyToast}
        autoHideDuration={3000}
        onClose={() => setCopyToast(false)}
        message="Tax Atlas link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
