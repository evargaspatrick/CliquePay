import { ArrowRight, CreditCard, Lock, Smartphone, Users, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl">CliquePay</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button 
            variant="highlight" 
            className="hidden md:inline-flex"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Split bills with friends, effortlessly
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-md">
            CliquePay makes it easy to split expenses, track debts, and settle up with friends and family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="primary"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('features').scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-600/20 rounded-2xl p-4 md:p-8 relative z-10">
            <img
              src="/images/CliquePay Logo.png"
              alt="CliquePay App Interface"
              className="rounded-xl shadow-2xl border border-purple-900/50 w-full max-w-[400px] mx-auto"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-6 -left-6 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-zinc-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CliquePay</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform is designed to make financial interactions between friends simple and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-purple-400" />
                </div>
                <CardTitle>Group Expenses</CardTitle>
                <CardDescription className="text-gray-400">
                  Create groups for trips, roommates, or events to track shared expenses.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-purple-400" />
                </div>
                <CardTitle>Instant Settlements</CardTitle>
                <CardDescription className="text-gray-400">
                  Transfer money instantly between friends with zero fees.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="text-purple-400" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription className="text-gray-400">
                  Designed for the way you live with a beautiful mobile experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="text-purple-400" />
                </div>
                <CardTitle>Secure Transactions</CardTitle>
                <CardDescription className="text-gray-400">
                  Bank-level security ensures your financial data stays protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700 md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Smart Expense Tracking</CardTitle>
                <CardDescription className="text-gray-400">
                  Automatically calculate who owes what and simplify complex group expenses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-700">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">Group Trip to Miami</div>
                    <div className="text-sm text-purple-400">$1,240 total</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                        <span>Alex</span>
                      </div>
                      <span className="text-green-400">+$320</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                        <span>Taylor</span>
                      </div>
                      <span className="text-red-400">-$180</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                        <span>Jordan</span>
                      </div>
                      <span className="text-red-400">-$140</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CliquePay Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to never worry about &quot;who owes what&quot; again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Create a Group</h3>
              <p className="text-gray-400">
                Start by creating a group and inviting your friends to join using their email or phone number.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Add Expenses</h3>
              <p className="text-gray-400">
                Log expenses as they happen. Split evenly or customize amounts for each person.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Settle Up</h3>
              <p className="text-gray-400">
                When it&apos;s time to pay up, CliquePay calculates the simplest way to settle all debts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to simplify group expenses?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have made splitting bills stress-free with CliquePay.
          </p>
          <Button 
            variant="primary"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6"
            onClick={() => navigate('/signup')}
          >
            Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-gray-400">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">CliquePay</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} CliquePay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

