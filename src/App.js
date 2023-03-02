import { Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout";

// mui components
import { CssBaseline, Box } from "@mui/material";

// project import
import Main from "./components/Main/Main";

function App() {
  return (
    <Box className="App">
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
