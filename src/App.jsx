import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Categories from './pages/Categories.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AllSkills from './pages/AllSkills.jsx';
import SkillPage from './pages/SkillPage.jsx';
import About from './pages/About.jsx';
import Search from './pages/Search.jsx';
import Local from './pages/Local.jsx';
import Philosophy from './pages/Philosophy.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/skills" element={<AllSkills />} />
        <Route path="/skills/:slug" element={<SkillPage />} />
        <Route path="/local" element={<Local />} />
        <Route path="/philosophy" element={<Philosophy />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
