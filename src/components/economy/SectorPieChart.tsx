import { Box, Chip, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { SectorComposition } from "../../types/country";

interface SectorPieChartProps {
  sectors?: SectorComposition;
}

interface SliceData {
  id: string;
  label: string;
  emoji: string;
  value: number;
  color: string;
}

export const SectorPieChart: React.FC<SectorPieChartProps> = ({ sectors }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  if (!sectors) return null;

  const rawServices = sectors.services ?? 0;
  const rawIndustry = sectors.industry ?? 0;
  const rawAgriculture = sectors.agriculture ?? 0;

  const sum = rawServices + rawIndustry + rawAgriculture;
  if (sum <= 0) return null;

  const slices: SliceData[] = [];

  if (rawServices > 0) {
    slices.push({
      id: "services",
      label: "Services & Tech",
      emoji: "💼",
      value: rawServices,
      color: "#38bdf8", // Sky blue
    });
  }

  if (rawIndustry > 0) {
    slices.push({
      id: "industry",
      label: "Industry & Manufacturing",
      emoji: "🏭",
      value: rawIndustry,
      color: "#f59e0b", // Amber
    });
  }

  if (rawAgriculture > 0) {
    slices.push({
      id: "agriculture",
      label: "Agriculture & Fishing",
      emoji: "🌾",
      value: rawAgriculture,
      color: "#10b981", // Emerald
    });
  }

  // World Bank Value Added by sector excludes net taxes on products.
  // If the total is less than 99%, add a "Net Taxes / Other" slice for visual completeness.
  const remainder = Math.max(0, 100 - sum);
  if (remainder >= 1.0) {
    slices.push({
      id: "other",
      label: "Net Taxes / Other",
      emoji: "📋",
      value: Math.round(remainder * 10) / 10,
      color: "#64748b", // Slate
    });
  }

  // Normalize slices to full 360 degrees
  const totalValue = slices.reduce((acc, s) => acc + s.value, 0);

  // SVG Geometry constants
  const size = 180;
  const center = size / 2;
  const outerRadius = 78;
  const innerRadius = 46;

  let cumulativeAngle = -90; // Start at 12 o'clock

  const slicePaths = slices.map((slice) => {
    const angle = (slice.value / totalValue) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // Convert polar to cartesian
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startRad);
    const y1 = center + outerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(endRad);
    const y2 = center + outerRadius * Math.sin(endRad);

    const ix1 = center + innerRadius * Math.cos(endRad);
    const iy1 = center + innerRadius * Math.sin(endRad);
    const ix2 = center + innerRadius * Math.cos(startRad);
    const iy2 = center + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    // SVG path string for a donut slice
    const d = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      "Z",
    ].join(" ");

    return {
      ...slice,
      d,
      startAngle,
      endAngle,
    };
  });

  const activeSlice = hoveredSlice
    ? slices.find((s) => s.id === hoveredSlice)
    : null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2.5,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            🥧 Economic Sector Breakdown (% of GDP)
          </Typography>
          {(sectors.servicesYear ||
            sectors.industryYear ||
            sectors.agricultureYear) && (
            <Chip
              label={`Data Year: ${sectors.servicesYear || sectors.industryYear || sectors.agricultureYear}`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                color: "text.secondary",
                borderColor: "rgba(255, 255, 255, 0.15)",
              }}
            />
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-around",
            gap: 2.5,
          }}
        >
          {/* SVG Donut Chart */}
          <Box
            sx={{
              position: "relative",
              width: size,
              height: size,
              flexShrink: 0,
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ overflow: "visible" }}
            >
              {slicePaths.map((slice) => {
                const isHovered = hoveredSlice === slice.id;
                return (
                  <Tooltip
                    key={slice.id}
                    title={`${slice.emoji} ${slice.label}: ${slice.value.toFixed(1)}% of GDP`}
                    arrow
                  >
                    <path
                      d={slice.d}
                      fill={slice.color}
                      stroke="rgba(15, 23, 42, 0.8)"
                      strokeWidth={1.5}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        opacity: isHovered ? 1 : hoveredSlice ? 0.55 : 0.92,
                        filter: isHovered
                          ? `drop-shadow(0 0 6px ${slice.color}88)`
                          : "none",
                        transformOrigin: `${center}px ${center}px`,
                        transform: isHovered ? "scale(1.04)" : "scale(1)",
                      }}
                      onMouseEnter={() => setHoveredSlice(slice.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  </Tooltip>
                );
              })}
            </svg>

            {/* Center Label in Donut */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                maxWidth: innerRadius * 1.8,
              }}
            >
              {activeSlice ? (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      color: activeSlice.color,
                      display: "block",
                      lineHeight: 1.1,
                    }}
                  >
                    {activeSlice.value.toFixed(1)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.65rem",
                      color: "text.secondary",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {activeSlice.label.split(" ")[0]}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      color: "text.primary",
                      display: "block",
                      lineHeight: 1.1,
                    }}
                  >
                    Sectors
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.65rem",
                      color: "text.secondary",
                      display: "block",
                    }}
                  >
                    GDP Share
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Legend Items */}
          <Stack spacing={1} sx={{ width: "100%", maxWidth: 300 }}>
            {slices.map((slice) => {
              const isHovered = hoveredSlice === slice.id;
              return (
                <Box
                  key={slice.id}
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 0.75,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    backgroundColor: isHovered
                      ? "rgba(255, 255, 255, 0.06)"
                      : "transparent",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: slice.color,
                        boxShadow: `0 0 6px ${slice.color}66`,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: isHovered ? 700 : 500,
                        color: isHovered ? "text.primary" : "text.secondary",
                      }}
                    >
                      {slice.emoji} {slice.label}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: slice.color,
                      ml: 1,
                    }}
                  >
                    {slice.value.toFixed(1)}%
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
