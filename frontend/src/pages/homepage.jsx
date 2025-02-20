import { ArrowRight, Users, Receipt, Wallet, CreditCard, Sparkles, ChevronRight } from "lucide-react";
import { FeatureCard } from '../components/FeatureCard';
import { Metric } from '../components/Metric';
import { useNavigate } from 'react-router-dom';
import logo from '/images/CliquePay Logo.png';

export default function CliquePay() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-400 to-yellow-500">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer hover:scale-105 transition-transform"
        >
          <img 
            src={logo} 
            alt="CliquePay Logo" 
            className="h-28 w-auto"
          />
        </div>
        <button className="text-black hover:text-pink-600 font-semibold px-4 py-2 rounded-lg flex items-center">
          Download App <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-pink-600 text-transparent bg-clip-text">
              Split Bills, Keep Friends
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-800">
              No more awkward money talks. CliquePay makes group expenses simple, fair, and fun. Perfect for dinners,
              trips, or any shared expenses!
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center mx-auto"
            >
              Start Splitting Bills <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-green-600" />}
              title="Group Expenses"
              description="Create groups for roommates, trips, or events. Track shared expenses effortlessly."
            />
            <FeatureCard
              icon={<Receipt className="h-8 w-8 text-pink-600" />}
              title="Smart Splitting"
              description="Split bills equally or customize amounts. Our smart calculator handles the math."
            />
            <FeatureCard
              icon={<Wallet className="h-8 w-8 text-yellow-600" />}
              title="Instant Settlements"
              description="Send and receive payments instantly. No more waiting for bank transfers."
            />
          </div>

          {/* Social Proof */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Trusted by Friend Groups Everywhere</h2>
              <div className="flex justify-center gap-8 items-center">
                <Metric number="1M+" label="Active Users" />
                <Metric number="50M+" label="Bills Split" />
                <Metric number="4.9" label="App Rating" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Bill-Splitting Stress-Free?</h2>
          <p className="text-xl mb-8">Join millions of users who trust CliquePay for their group expenses</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg flex items-center font-semibold">
              <CreditCard className="mr-2 h-5 w-5" />
              Download iOS App
            </button>
            <button className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg flex items-center font-semibold">
              <Sparkles className="mr-2 h-5 w-5" />
              Download Android App
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/90 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} CliquePay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

