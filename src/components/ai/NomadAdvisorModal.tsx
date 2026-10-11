import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  TextField,
  LinearProgress,
  Card,
  CircularProgress,
  Tooltip,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyIcon from "@mui/icons-material/VpnKey";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { UnifiedCountry } from "../../types/country";
import { getCountryEmoji } from "../../utils/countryUtils";
import {
  CountryMatchScore,
  calculateMatchesFromTextQuery,
} from "../../utils/nomadAdvisorEngine";
import {
  generateNomadRelocationDossier,
  getStoredApiKey,
  setStoredApiKey,
} from "../../services/aiService";

function renderMarkdownInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "inherit", fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const QUICK_PROMPTS = [
  "🏖️ 0% tax on foreign income & warm coastal living",
  "💻 Remote tech nomad in Europe with fast internet & safe cities",
  "🌴 Low-cost tropical living, English-friendly & territorial tax",
  "💼 Startup founder seeking low corporate tax & international flight hub",
];

interface NomadAdvisorModalProps {
  open: boolean;
  onClose: () => void;
  countries: UnifiedCountry[];
  onAddToCompare?: (countryCode: string) => void;
}

export default function NomadAdvisorModal({
  open,
  onClose,
  countries,
  onAddToCompare,
}: NomadAdvisorModalProps) {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [matches, setMatches] = useState<CountryMatchScore[]>([]);
  const [dossierText, setDossierText] = useState<string | null>(null);

  // API Key management
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleGenerate = async (overridePrompt?: string) => {
    const textToUse = overridePrompt !== undefined ? overridePrompt : prompt;
    const finalPrompt =
      textToUse.trim() ||
      "Remote tech worker looking for territorial or zero tax, fast internet, and safe living.";

    setIsGenerating(true);
    setDossierText(null);

    // Calculate algorithmic matches based on prompt
    const calculatedMatches = calculateMatchesFromTextQuery(
      finalPrompt,
      countries,
    );
    setMatches(calculatedMatches);

    try {
      const result = await generateNomadRelocationDossier(
        finalPrompt,
        calculatedMatches,
      );
      setDossierText(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPromptClick = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    handleGenerate(quickPrompt);
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: { xs: "96vw", sm: 960, md: 1040 },
          width: "100%",
          borderRadius: 3.5,
          backgroundColor: "background.paper",
          backgroundImage: "none",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)",
              color: "primary.light",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <AutoAwesomeIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              NomadAI Relocation Matchmaker
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Type your ideal lifestyle or tax preferences to get an instant
              tailored relocation plan
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3.5 } }}>
        {/* Simple Text Input Section */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "0.75rem",
          }}
        >
          What are your relocation & lifestyle requirements?
        </Typography>

        {/* Quick Suggestion Pills */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              display: "block",
              mb: 0.8,
            }}
          >
            Quick ideas:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1,
            }}
          >
            {QUICK_PROMPTS.map((quickPrompt, idx) => (
              <Chip
                key={idx}
                label={quickPrompt}
                size="small"
                clickable
                onClick={() => handleQuickPromptClick(quickPrompt)}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  px: 0.8,
                  py: 1.8,
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  "&:hover": {
                    borderColor: "primary.light",
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Input & Action Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          sx={{ mb: 2.5 }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            autoFocus
            placeholder="E.g. I work remotely in tech making $120k. Looking for a warm coastal country with 0% tax on foreign income, fast internet, safe cities..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "rgba(30, 41, 59, 0.35)",
                fontSize: "0.92rem",
              },
            }}
          />

          <Button
            variant="contained"
            disabled={isGenerating}
            onClick={() => handleGenerate()}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon fontSize="small" />
              )
            }
            sx={{
              px: 2.5,
              py: 1,
              height: 42,
              minWidth: { xs: "100%", sm: 115 },
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: "0.85rem",
              textTransform: "none",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
              whiteSpace: "nowrap",
              mt: { xs: 0, sm: 0.5 },
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
              },
            }}
          >
            {isGenerating ? "Analyzing..." : "Generate"}
          </Button>
        </Stack>

        {/* Generated Response Section */}
        <Collapse in={Boolean(dossierText || isGenerating)}>
          <Box sx={{ mt: 3 }}>
            {isGenerating ? (
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "rgba(99, 102, 241, 0.05)",
                  border: "1px solid",
                  borderColor: "primary.dark",
                  textAlign: "center",
                }}
              >
                <CircularProgress size={28} sx={{ mb: 1.5 }} />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Analyzing Tax Codes, Visas & Infrastructure...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Scanning 250+ sovereign jurisdictions against your profile
                </Typography>
              </Card>
            ) : (
              <Stack spacing={2.5}>
                {/* AI Dossier Report Card */}
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: "rgba(99, 102, 241, 0.06)",
                    border: "1.5px solid",
                    borderColor: "primary.light",
                    boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: 1.5,
                      pb: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AutoAwesomeIcon
                        sx={{ color: "primary.light", fontSize: 22 }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Synthesized AI Relocation Report
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => setDossierText(null)}
                      aria-label="hide report"
                      sx={{ color: "text.secondary" }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Box
                    sx={{
                      typography: "body2",
                      color: "text.primary",
                      lineHeight: 1.6,
                      "& h3": {
                        fontSize: "1rem",
                        fontWeight: 800,
                        mt: 1.5,
                        mb: 0.5,
                      },
                      "& h4": {
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        mt: 1.5,
                        mb: 0.3,
                        color: "primary.light",
                      },
                      "& ul": { pl: 2, my: 0.5 },
                      "& li": { my: 0.2 },
                      "& p": { my: 0.4 },
                    }}
                  >
                    {dossierText?.split("\n").map((line, lineIdx) => {
                      if (line.startsWith("### ")) {
                        return (
                          <Typography
                            key={lineIdx}
                            variant="subtitle1"
                            sx={{ fontWeight: 800, mt: 1.5, mb: 0.5 }}
                          >
                            {renderMarkdownInline(line.replace("### ", ""))}
                          </Typography>
                        );
                      }
                      if (line.startsWith("#### ")) {
                        return (
                          <Typography
                            key={lineIdx}
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                              color: "primary.light",
                              mt: 1.2,
                              mb: 0.2,
                            }}
                          >
                            {renderMarkdownInline(line.replace("#### ", ""))}
                          </Typography>
                        );
                      }
                      if (line.startsWith("* ")) {
                        return (
                          <Typography
                            key={lineIdx}
                            variant="body2"
                            sx={{
                              pl: 1.5,
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 0.5,
                              my: 0.2,
                            }}
                          >
                            •{" "}
                            <span>
                              {renderMarkdownInline(line.replace("* ", ""))}
                            </span>
                          </Typography>
                        );
                      }
                      if (!line.trim())
                        return <Box key={lineIdx} sx={{ height: 6 }} />;
                      return (
                        <Typography
                          key={lineIdx}
                          variant="body2"
                          sx={{ my: 0.3 }}
                        >
                          {renderMarkdownInline(line)}
                        </Typography>
                      );
                    })}
                  </Box>
                </Card>

                {/* Top Matched Country Cards */}
                {matches.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontSize: "0.75rem",
                        mb: 1.5,
                      }}
                    >
                      Top Sovereign Matches for Your Query ({matches.length})
                    </Typography>

                    <Stack spacing={1.2}>
                      {matches.slice(0, 3).map((match, idx) => {
                        const country = match.country;
                        return (
                          <Card
                            key={country.code}
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 2.5,
                              borderColor:
                                idx === 0 ? "primary.main" : "divider",
                              backgroundColor:
                                idx === 0
                                  ? "rgba(99, 102, 241, 0.05)"
                                  : "background.paper",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ mb: 0.5 }}
                                >
                                  <Typography
                                    sx={{ fontSize: "1.4rem", lineHeight: 1 }}
                                  >
                                    {getCountryEmoji(country.code)}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 800 }}
                                  >
                                    {country.name}
                                  </Typography>
                                  <Chip
                                    label={`${match.score}% Match`}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.72rem",
                                      backgroundColor:
                                        idx === 0
                                          ? "primary.main"
                                          : "action.selected",
                                      color: "#fff",
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={0.8}
                                  flexWrap="wrap"
                                  sx={{ gap: 0.5, mt: 0.8 }}
                                >
                                  <Chip
                                    label={match.taxSummary}
                                    size="small"
                                    sx={{
                                      fontSize: "0.7rem",
                                      backgroundColor:
                                        "rgba(16, 185, 129, 0.12)",
                                      color: "#10b981",
                                      fontWeight: 600,
                                    }}
                                  />
                                  {country.gdp?.internetUsers && (
                                    <Chip
                                      label={`💻 ${country.gdp.internetUsers.toFixed(0)}% Internet`}
                                      size="small"
                                      sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                  {country.blocs?.isSchengen && (
                                    <Chip
                                      label="🇪🇺 Schengen"
                                      size="small"
                                      sx={{
                                        fontSize: "0.7rem",
                                        backgroundColor:
                                          "rgba(59, 130, 246, 0.12)",
                                        color: "#60a5fa",
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Box>

                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                  alignSelf: { xs: "flex-end", sm: "center" },
                                }}
                              >
                                {onAddToCompare && (
                                  <Tooltip title="Add to Compare">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        onAddToCompare(country.code)
                                      }
                                      sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                      }}
                                    >
                                      <CompareArrowsIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Button
                                  size="small"
                                  variant="outlined"
                                  endIcon={<OpenInNewIcon fontSize="small" />}
                                  onClick={() => {
                                    onClose();
                                    navigate(
                                      `/country/${country.code.toLowerCase()}`,
                                    );
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Explore
                                </Button>
                              </Stack>
                            </Box>

                            <Box sx={{ mt: 1.2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={match.score}
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: "divider",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 2,
                                    background:
                                      match.score >= 90
                                        ? "linear-gradient(90deg, #10b981, #06b6d4)"
                                        : "linear-gradient(90deg, #6366f1, #a855f7)",
                                  },
                                }}
                              />
                            </Box>
                          </Card>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Collapse>

        {/* API Key Toggle Footer */}
        <Box sx={{ mt: 2.5 }}>
          <Button
            size="small"
            startIcon={<KeyIcon fontSize="small" />}
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            {getStoredApiKey()
              ? "🔑 Gemini API Key configured (Click to edit)"
              : "⚙️ Connect Gemini API Key (Optional for dynamic live LLM)"}
          </Button>

          <Collapse in={showApiKeyInput}>
            <Box
              sx={{
                mt: 1.5,
                p: 2,
                borderRadius: 2.5,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                Enter your Google Gemini API key to enable live generative
                dossiers. Keys are stored safely in your browser&apos;s
                localStorage.
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveApiKey}
                  sx={{ borderRadius: 2, textTransform: "none", minWidth: 80 }}
                >
                  {apiKeySaved ? "Saved!" : "Save"}
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
