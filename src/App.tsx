import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CountryComparePage from "./pages/CountryComparePage";
import CountryDetailPage from "./pages/CountryDetailPage";
import CountryListPage from "./pages/CountryListPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CountryListPage />} />
      <Route path="/country/:countryCode" element={<CountryDetailPage />} />
      <Route path="/compare" element={<CountryComparePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
