import Navbar from "../component/Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 animate-fade-in">
        {children}
      </main>
    </div>
  );
}

export default Layout;
