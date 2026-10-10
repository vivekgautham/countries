import { Box, CircularProgress, Container } from "@mui/material";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/layout/Footer";

// Lazy load pages for code splitting
const CountryListPage = lazy(() => import("./pages/CountryListPage"));
const CountryDetailPage = lazy(() => import("./pages/CountryDetailPage"));
const CountryComparePage = lazy(() => import("./pages/CountryComparePage"));
const CountryRankingsPage = lazy(() => import("./pages/CountryRankingsPage"));
const TaxAtlasPage = lazy(() => import("./pages/TaxAtlasPage"));

const LoadingFallback = () => (
  <Container
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress />
  </Container>
);

export default function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<CountryListPage />} />
            <Route
              path="/country/:countryCode"
              element={<CountryDetailPage />}
            />
            <Route path="/compare" element={<CountryComparePage />} />
            <Route path="/rankings" element={<CountryRankingsPage />} />
            <Route path="/tax-atlas" element={<TaxAtlasPage />} />
            <Route path="/tax" element={<Navigate to="/tax-atlas" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}
