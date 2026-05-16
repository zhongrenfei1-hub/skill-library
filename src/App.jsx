import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// Eager: Home (initial route, almost always)
// Lazy: everything else (split into per-page chunks)
const Categories   = lazy(() => import('./pages/Categories.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const AllSkills    = lazy(() => import('./pages/AllSkills.jsx'));
const SkillPage    = lazy(() => import('./pages/SkillPage.jsx'));
const Local        = lazy(() => import('./pages/Local.jsx'));
const Philosophy   = lazy(() => import('./pages/Philosophy.jsx'));
const Search       = lazy(() => import('./pages/Search.jsx'));
const About        = lazy(() => import('./pages/About.jsx'));
const NotFound     = lazy(() => import('./pages/NotFound.jsx'));

function PageLoader() {
  return (
    <div className="container-wide py-32 text-center text-ink-mute text-sm">
      正在加载...
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Layout>
  );
}
