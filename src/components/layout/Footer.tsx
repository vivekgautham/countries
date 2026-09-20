import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExploreIcon from "@mui/icons-material/Explore";
import {
  Box,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { APP_NAME, APP_VERSION } from "../../constants/version";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(12px)",
        py: { xs: 4, sm: 5 },
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Top section: Branding, Version & Navigation Links */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2.5}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "1.15rem",
                    background:
                      "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <span>🌍</span> {APP_NAME}
                </Typography>

                <Tooltip title={`Application Version v${APP_VERSION}`} arrow>
                  <Chip
                    label={`v${APP_VERSION}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      color: "#a5b4fc",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      borderRadius: 1.5,
                    }}
                  />
                </Tooltip>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: 520,
                  fontSize: "0.85rem",
                }}
              >
                Comprehensive global atlas featuring macroeconomic indicators,
                geopolitical blocs, demographic trends, and aviation
                infrastructure.
              </Typography>
            </Stack>

            {/* Quick Links */}
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.light" },
                }}
              >
                <ExploreIcon sx={{ fontSize: 18 }} />
                Explore
              </Link>
              <Link
                component={RouterLink}
                to="/rankings"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.light" },
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 18 }} />
                Rankings
              </Link>
              <Link
                component={RouterLink}
                to="/tax-atlas"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  "&:hover": { color: "secondary.light" },
                }}
              >
                <AccountBalanceIcon sx={{ fontSize: 18 }} />
                Tax Atlas
              </Link>
              <Link
                component={RouterLink}
                to="/compare"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.light" },
                }}
              >
                <CompareArrowsIcon sx={{ fontSize: 18 }} />
                Compare
              </Link>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.07)" }} />

          {/* Bottom section: Attribution */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.78rem" }}
            >
              Data powered by{" "}
              <Link
                href="https://data.worldbank.org/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "text.secondary",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.light" },
                }}
              >
                World Bank (WDI)
              </Link>
              ,{" "}
              <Link
                href="https://davidmegginson.github.io/ourairports-data/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "text.secondary",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.light" },
                }}
              >
                OurAirports
              </Link>
              {" & "}
              <Link
                href="https://restcountries.com/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "text.secondary",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.light" },
                }}
              >
                REST Countries
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
