import {
  Box,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ClearIcon from "@mui/icons-material/Clear";
import { AskAtlasResult, CURATED_AI_PROMPTS } from "../../utils/askAtlasEngine";

interface AskAtlasBannerProps {
  result: AskAtlasResult | null;
  currentSearchTerm: string;
  onSelectPrompt: (prompt: string) => void;
  onClear: () => void;
  matchCount: number;
}

export default function AskAtlasBanner({
  result,
  currentSearchTerm,
  onSelectPrompt,
  onClear,
  matchCount,
}: AskAtlasBannerProps) {
  // If user has a natural language result active
  if (result && result.isNaturalLanguage) {
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)",
          border: "1px solid",
          borderColor: "rgba(99, 102, 241, 0.35)",
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 0.8 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.3,
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "#ffffff",
                fontSize: "0.74rem",
                fontWeight: 700,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 13 }} />
              Ask Atlas AI
            </Box>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.82rem" }}
            >
              Identified {result.badges.length} Criteria:
            </Typography>

            {result.badges.map((badge, idx) => (
              <Chip
                key={idx}
                label={badge}
                size="small"
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "primary.light" }}
            >
              {matchCount} countr{matchCount === 1 ? "y" : "ies"} matched
            </Typography>
            <Tooltip title="Clear AI search filter">
              <IconButton
                size="small"
                onClick={onClear}
                sx={{ color: "text.secondary" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    );
  }

  // If no natural language search is currently active, show the curated AI prompts
  if (!currentSearchTerm) {
    return (
      <Box sx={{ mt: 0.5, overflowX: "auto", pb: 0.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 13, color: "primary.light" }} />
            Try Ask Atlas:
          </Typography>

          <Stack
            direction="row"
            spacing={0.8}
            sx={{ flexWrap: "nowrap", overflowX: "auto" }}
          >
            {CURATED_AI_PROMPTS.slice(0, 4).map((prompt, idx) => (
              <Chip
                key={idx}
                label={prompt}
                size="small"
                clickable
                onClick={() => onSelectPrompt(prompt)}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: "primary.light",
                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  }

  return null;
}
