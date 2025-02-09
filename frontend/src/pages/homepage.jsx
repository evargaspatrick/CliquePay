import Button from '../components/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-blue-600 text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-6"> {/* Increased gap from 2 to 6 for ~1 inch spacing */}
          <img 
            src="/images/Watchtower-no-words.png" 
            alt="WatchTower Logo" 
            className="h-28" // Increased from h-8 to h-24 (3x larger)
          />
          <h1 className="text-2xl font-semibold">Watch Tower</h1>
        </div>
        <div className="flex gap-4 mr-8"> {/* Added mr-8 for ~0.5 inch margin */}
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Sign-up
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Stay Alert, Stay Secure</h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Watch Tower provides real-time alerts and monitoring to keep you safe and informed.
        </p>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 text-lg font-semibold rounded-lg shadow-md">
          Get Started
        </Button>
      </section>
    </div>
  );
}
