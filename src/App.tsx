import { Box } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/layout/Footer";
import CountryComparePage from "./pages/CountryComparePage";
import CountryDetailPage from "./pages/CountryDetailPage";
import CountryListPage from "./pages/CountryListPage";

export default function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<CountryListPage />} />
          <Route path="/country/:countryCode" element={<CountryDetailPage />} />
          <Route path="/compare" element={<CountryComparePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}
