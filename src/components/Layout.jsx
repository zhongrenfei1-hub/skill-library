import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CommandPalette from './CommandPalette.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
      <CommandPalette />
    </div>
  );
}
