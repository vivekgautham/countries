import React, { useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckIcon from "@mui/icons-material/Check";
import { APP_NAME, APP_VERSION, BUILD_DATE } from "../../constants/version";
import { useThemeContext } from "../../theme/ThemeContext";
import { ThemeColorId } from "../../theme/theme";

interface AppVersionBadgeProps {
  compact?: boolean;
}

export default function AppVersionBadge({
  compact: _compact = false,
}: AppVersionBadgeProps) {
  const formattedBuildDate = BUILD_DATE.slice(0, 10);
  const { colorId, availableThemes, setColorId, currentColorTheme } =
    useThemeContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenThemeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseThemeMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectColor = (selectedId: ThemeColorId) => {
    setColorId(selectedId);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Color Palette Menu Button */}
      <Tooltip
        title={`Theme: ${currentColorTheme.name}`}
        arrow
        placement="bottom"
      >
        <IconButton
          onClick={handleOpenThemeMenu}
          size="small"
          aria-label="choose color theme"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            color: currentColorTheme.primary.main,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "action.hover",
              borderColor: currentColorTheme.primary.main,
            },
          }}
        >
          <PaletteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* App Version Tooltip Badge */}
      <Tooltip
        title={
          <Box sx={{ p: 0.5 }}>
            <Box sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
              {APP_NAME} v{APP_VERSION}
            </Box>
            <Box
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.68rem",
                mt: 0.25,
              }}
            >
              Build: {formattedBuildDate}
            </Box>
          </Box>
        }
        arrow
        placement="bottom-end"
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            color: "text.secondary",
            opacity: 0.75,
            transition: "all 0.2s ease-in-out",
            px: 1,
            py: 0.35,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            backdropFilter: "blur(8px)",
            fontSize: "0.74rem",
            fontWeight: 600,
            cursor: "default",
            userSelect: "none",
            "&:hover": {
              opacity: 1,
              color: "primary.main",
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          v{APP_VERSION}
        </Box>
      </Tooltip>

      {/* Theme Selection Menu */}
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseThemeMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            minWidth: 230,
            borderRadius: 3,
            p: 1,
            backgroundColor: "background.paper",
            backdropFilter: "blur(16px)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Color Theme
          </Typography>
        </Box>

        {availableThemes.map((themeItem) => {
          const isSelected = themeItem.id === colorId;
          return (
            <MenuItem
              key={themeItem.id}
              onClick={() => handleSelectColor(themeItem.id)}
              sx={{
                borderRadius: 2,
                my: 0.3,
                px: 1.5,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isSelected
                  ? `${themeItem.primary.main}18`
                  : "transparent",
                "&:hover": {
                  backgroundColor: `${themeItem.primary.main}25`,
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Dual Color Swatch Circle */}
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${themeItem.primary.main} 50%, ${themeItem.secondary.main} 50%)`,
                    border: "2px solid",
                    borderColor: isSelected
                      ? themeItem.primary.main
                      : "divider",
                    boxShadow: isSelected
                      ? `0 0 0 2px ${themeItem.primary.main}40`
                      : "none",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "text.primary" : "text.secondary",
                  }}
                >
                  {themeItem.name}
                </Typography>
              </Stack>
              {isSelected && (
                <CheckIcon
                  sx={{
                    fontSize: 16,
                    color: themeItem.primary.main,
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Stack>
  );
}
