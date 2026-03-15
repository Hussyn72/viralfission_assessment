import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Gallery from "./pages/Gallery.jsx";
import Upload from "./pages/Upload.jsx";
import Detail from "./pages/Detail.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/videos/:id" element={<Detail />} />
      </Routes>
    </Layout>
  );
}
