import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Avatar,
  Button,
  Chip,
  Paper,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UnifiedCountry } from "../../types/country";
import { getCountryEmoji } from "../../utils/countryUtils";

interface CompareFloatingDockProps {
  selectedCodes: string[];
  allCountries: UnifiedCountry[];
  onRemove: (code: string) => void;
  onClear: () => void;
}

export default function CompareFloatingDock({
  selectedCodes,
  allCountries,
  onRemove,
  onClear,
}: CompareFloatingDockProps) {
  const navigate = useNavigate();

  const selectedCountries = selectedCodes
    .map((code) =>
      allCountries.find((c) => c.code.toUpperCase() === code.toUpperCase()),
    )
    .filter((c): c is UnifiedCountry => Boolean(c));

  const isVisible = selectedCodes.length > 0;

  const handleCompareClick = () => {
    navigate(`/compare?c=${selectedCodes.join(",")}`);
  };

  return (
    <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
      <Paper
        elevation={12}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          left: "50%",
          transform: "translateX(-50%) !important",
          zIndex: 1300,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderRadius: 4,
          backgroundColor: "rgba(30, 41, 59, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(99, 102, 241, 0.4)",
          boxShadow:
            "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.3)",
          maxWidth: "calc(100vw - 32px)",
          width: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={{ xs: 1.5, sm: 2.5 }}
        >
          {/* Label & Selected List */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            flexWrap="wrap"
            justifyContent="center"
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <CompareArrowsIcon
                sx={{ color: "primary.light", fontSize: 20 }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                }}
              >
                Compare ({selectedCodes.length}/4):
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ gap: 0.5 }}
            >
              {selectedCountries.map((country) => (
                <Tooltip key={country.code} title={country.name} arrow>
                  <Chip
                    avatar={
                      <Avatar
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        sx={{
                          width: 22,
                          height: 16,
                          borderRadius: 0.5,
                          fontSize: "0.85rem",
                          backgroundColor: "transparent",
                        }}
                      >
                        {getCountryEmoji(country.code)}
                      </Avatar>
                    }
                    label={country.name}
                    onDelete={() => onRemove(country.code)}
                    deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "text.primary",
                      fontWeight: 600,
                      "& .MuiChip-deleteIcon": {
                        color: "text.secondary",
                        "&:hover": { color: "error.light" },
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Stack>

          {/* Action Buttons */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="small"
              variant="text"
              color="inherit"
              startIcon={<DeleteOutlineIcon fontSize="small" />}
              onClick={onClear}
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                "&:hover": { color: "text.primary" },
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<CompareArrowsIcon />}
              onClick={handleCompareClick}
              disabled={selectedCodes.length < 2}
              sx={{
                px: 2,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              }}
            >
              Compare{" "}
              {selectedCodes.length >= 2
                ? `(${selectedCodes.length})`
                : "(Min 2)"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
}
