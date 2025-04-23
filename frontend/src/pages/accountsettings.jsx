import { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, CreditCard, KeyRound, Lock, Save, User, X, Check, Bell } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageLayout, Header, Section, Footer } from "../components/layout/PageLayout";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import cliquepayLogo from "../assets/images/CliquePay.jpeg";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    avatar: null
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'VISA',
      lastFour: '4242',
      expiryDate: '09/25',
      isDefault: true,
      bgColor: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'MC',
      lastFour: '8888',
      expiryDate: '05/24',
      isDefault: false,
      bgColor: 'bg-gray-600'
    }
  ]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Changes saved successfully!');
  };

  // Payment method functions
  const handleRemovePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleAddPaymentMethod = () => {
    // Simple validation
    if (newPaymentMethod.cardNumber.length < 15 || 
        !newPaymentMethod.expiryDate || 
        !newPaymentMethod.cardholderName) {
      alert('Please complete all required fields');
      return;
    }
    
    // Determine card type based on first digit
    const firstDigit = newPaymentMethod.cardNumber.charAt(0);
    let type = 'OTHER';
    let bgColor = 'bg-gray-600';
    
    if (firstDigit === '4') {
      type = 'VISA';
      bgColor = 'bg-blue-500';
    } else if (firstDigit === '5') {
      type = 'MC';
      bgColor = 'bg-gray-600';
    } else if (firstDigit === '3') {
      type = 'AMEX';
      bgColor = 'bg-green-600';
    }
    
    // Create new payment method
    const newMethod = {
      id: Date.now().toString(),
      type,
      lastFour: newPaymentMethod.cardNumber.slice(-4),
      expiryDate: newPaymentMethod.expiryDate,
      isDefault: paymentMethods.length === 0, // Make default if first card
      bgColor
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentModal(false);
    setNewPaymentMethod({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
  };

  // Add Payment Modal Component
  const AddPaymentModal = () => {
    if (!showAddPaymentModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add Payment Method</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => setShowAddPaymentModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={newPaymentMethod.cardholderName}
                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={newPaymentMethod.cardNumber}
                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value.replace(/\D/g, '')})}
                maxLength={16}
                className="bg-zinc-800 border-zinc-700 mt-1"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={newPaymentMethod.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d/]/g, '');
                    if (value.length > 2 && !value.includes('/')) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    setNewPaymentMethod({...newPaymentMethod, expiryDate: value});
                  }}
                  maxLength={5}
                  className="bg-zinc-800 border-zinc-700 mt-1"
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={newPaymentMethod.cvv}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvv: e.target.value.replace(/\D/g, '')})}
                  maxLength={3}
                  className="bg-zinc-800 border-zinc-700 mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowAddPaymentModal(false)}
            >
              Cancel
            </Button>
            
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleAddPaymentMethod}
            >
              Add Card
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const TabPanel = ({ id, active, children }) => {
    if (id !== activeTab) return null;
    return <div>{children}</div>;
  };

  TabPanel.propTypes = {
    id: PropTypes.string.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node.isRequired
  };
  
  return (
    <PageLayout>
      <Header className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
            <img 
              src={cliquepayLogo} 
              alt="CliquePay Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-xl">CliquePay</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="!text-white"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </Header>

      <Section className="pt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 shrink-0">
              <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === "profile" ? "bg-purple-900/30 border-l-4 border-purple-500" : "hover:bg-zinc-700"}`}
                >
                  <User className={`w-4 h-4 ${activeTab === "profile" ? "text-purple-400" : ""}`} /> 
                  <span className="font-medium">Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === "security" ? "bg-purple-900/30 border-l-4 border-purple-500" : "hover:bg-zinc-700"}`}
                >
                  <Lock className={`w-4 h-4 ${activeTab === "security" ? "text-purple-400" : ""}`} /> 
                  <span className="font-medium">Security</span>
                </button>
                <button 
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === "notifications" ? "bg-purple-900/30 border-l-4 border-purple-500" : "hover:bg-zinc-700"}`}
                >
                  <Bell className={`w-4 h-4 ${activeTab === "notifications" ? "text-purple-400" : ""}`} /> 
                  <span className="font-medium">Notifications</span>
                </button>
                <button 
                  onClick={() => setActiveTab("payment")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === "payment" ? "bg-purple-900/30 border-l-4 border-purple-500" : "hover:bg-zinc-700"}`}
                >
                  <CreditCard className={`w-4 h-4 ${activeTab === "payment" ? "text-purple-400" : ""}`} /> 
                  <span className="font-medium">Payment Methods</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <TabPanel id="profile">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your personal information and how others see you on CliquePay
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={user.name} 
                              onChange={(e) => setUser({...user, name: e.target.value})} 
                              className="bg-zinc-900 border-zinc-700 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={user.email} 
                              onChange={(e) => setUser({...user, email: e.target.value})}
                              className="bg-zinc-900 border-zinc-700 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              type="tel" 
                              value={user.phone} 
                              onChange={(e) => setUser({...user, phone: e.target.value})}
                              className="bg-zinc-900 border-zinc-700 mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-start">
                          <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                            {user.avatar ? (
                              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-12 h-12 text-zinc-400" />
                            )}
                          </div>
                          <Button variant="outline" className="mb-2">Upload Photo</Button>
                          <p className="text-xs text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabPanel>
              
              <TabPanel id="security">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your password and account security options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <Button variant="outline" className="flex gap-2">
                        <KeyRound className="h-4 w-4" /> Change Password
                      </Button>
                    </div>
                    
                    <div className="pt-6 border-t border-zinc-700">
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Add an extra layer of security to your account</p>
                          <p className="text-xs text-gray-400 mt-1">We&apos;ll ask for a verification code in addition to your password</p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-zinc-700">
                      <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                      <div className="space-y-4">
                        <div className="bg-zinc-900 p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Chrome on Windows</p>
                            <p className="text-xs text-gray-400">Current session • Last active: Just now</p>
                          </div>
                          <div className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-md">
                            Current
                          </div>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Safari on iPhone</p>
                            <p className="text-xs text-gray-400">Last active: Yesterday at 2:15 PM</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30">
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabPanel>

              <TabPanel id="notifications">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription className="text-gray-400">
                      Control how and when CliquePay contacts you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Notifications</p>
                          <p className="text-sm text-gray-400">Get notified when someone sends you money</p>
                        </div>
                        <Switch id="payment-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Expense Added</p>
                          <p className="text-sm text-gray-400">Get notified when a new expense is added to a group</p>
                        </div>
                        <Switch id="expense-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reminders</p>
                          <p className="text-sm text-gray-400">Get reminded about unsettled payments</p>
                        </div>
                        <Switch id="reminder-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Updates</p>
                          <p className="text-sm text-gray-400">Receive news and promotional offers</p>
                        </div>
                        <Switch id="marketing-notifications" />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-zinc-700">
                      <h3 className="text-lg font-medium mb-4">Notification Methods</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-400">Receive notifications via email</p>
                          </div>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-400">Receive notifications on your device</p>
                          </div>
                          <Switch id="push-notifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-400">Receive text messages for important updates</p>
                          </div>
                          <Switch id="sms-notifications" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabPanel>
              
              <TabPanel id="payment">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription className="text-gray-400">
                      Add or remove payment methods to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {paymentMethods.length === 0 ? (
                        <div className="text-center p-6 bg-zinc-900 rounded-md">
                          <p className="text-gray-400 mb-4">You don&apos;t have any payment methods yet</p>
                        </div>
                      ) : (
                        paymentMethods.map((method) => (
                          <div key={method.id} className="bg-zinc-900 p-4 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-8 ${method.bgColor} rounded-md flex items-center justify-center text-xs font-bold text-white`}>
                                {method.type}
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• {method.lastFour}</p>
                                <p className="text-xs text-gray-400">Expires {method.expiryDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {method.isDefault ? (
                                <div className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-md flex items-center">
                                  <Check className="w-3 h-3 mr-1" /> Default
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 text-xs"
                                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              
                              {!method.isDefault && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                  onClick={() => handleRemovePaymentMethod(method.id)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => setShowAddPaymentModal(true)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabPanel>
            </div>
          </div>
        </div>
      </Section>

      <Footer className="bg-zinc-950">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={cliquepayLogo} 
                alt="CliquePay Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-xl">CliquePay</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
      </Footer>
      
      <AddPaymentModal />
    </PageLayout>
  );
}