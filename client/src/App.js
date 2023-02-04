import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import ExplorePage from "./pages/ExplorePage";
import SearchPage from "./pages/SearchPage";
import BookDetailPage from "./pages/BookDetailPage";
import RecommendPage from "./pages/RecommendPage";
import SurprisePage from "./pages/SurprisePage";
import ProfilePage from "./pages/ProfilePage";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// export const Context = createContext();
const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
  },
});

function App() {
  return (
    // <Context.Provider>
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Routes>
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/" element={<LoginPage />} />
            {sessionStorage.getItem("accessToken") !== null ? (
              <>
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/surprise" element={<SurprisePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/recommend" element={<RecommendPage />} />
                <Route path="/detail" element={<BookDetailPage />} />
              </>
            ) : null}
            {/* catch all: back to root page if not logged in */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
  // );
}

export default App;
