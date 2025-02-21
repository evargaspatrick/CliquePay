import { FriendCard } from '../components/FriendCard';
import { ProfileDropdown } from '../components/ProfileDropdown';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faGears, faChartSimple, faMoneyBillTransfer, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import logo from '/images/CliquePay Logo.png';
import '../App.css';
import { useSecurity } from '../context/SecurityContext';
import { useState, useEffect } from 'react';

FriendCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired
};

const Dashboard = () => {
  const security = useSecurity();
  const [billSummary, setBillSummary] = useState({
    totalBill: 0,
    youOwe: 0,
    theyOwe: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await security.csrf.fetchWithCSRF('http://127.0.0.1:8000/api/dashboard/', {
        method: 'GET'
      });
      const data = await response.json();
      setBillSummary(data.billSummary);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleSettleUp = async () => {
    try {
      await security.csrf.fetchWithCSRF('http://127.0.0.1:8000/api/settle-up/', {
        method: 'POST'
      });
      // Refresh dashboard data after settling up
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to settle up:', error);
    }
  };

  const handleRemind = async (activityId) => {
    try {
      await security.csrf.fetchWithCSRF(`http://127.0.0.1:8000/api/remind/${activityId}`, {
        method: 'POST'
      });
      // Could show a success message here
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="bg-gradient-to-r from-yellow-500 to-pink-500 px-5 py-2 rounded-full shadow-xl">
          <img 
            src={logo} 
            alt="CliquePay Logo" 
            className="h-28 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            Send Payment
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            Request Payment
          </button>
          <ProfileDropdown />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-md">
        <ul className="flex justify-around p-4 text-lg font-semibold text-gray-700">
          <li className="cursor-pointer hover:text-green-600 border-b-2 border-transparent hover:border-green-600 flex items-center">
            Dashboard <FontAwesomeIcon icon={faHouseUser} className="ml-2 text-green-600 text-2xl" />
          </li>
          <li className="cursor-pointer hover:text-green-600 border-b-2 border-transparent hover:border-green-600 flex items-center">
            Transactions <FontAwesomeIcon icon={faMoneyBillTransfer} className="ml-2 text-green-600 text-2xl" />
          </li>
          <li className="cursor-pointer hover:text-green-600 border-b-2 border-transparent hover:border-green-600 flex items-center">
            Analytics <FontAwesomeIcon icon={faChartSimple} className="ml-2 text-green-600 text-2xl" />
          </li>
          <li className="cursor-pointer hover:text-green-600 border-b-2 border-transparent hover:border-green-600 flex items-center">
            Settings <FontAwesomeIcon icon={faGears} className="ml-2 text-green-600 text-2xl" />
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Bill Summary Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Bill Summary</h2>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-semibold">Total Bill</p>
                <p className="text-3xl font-bold">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-1" />{billSummary.totalBill}
                </p>
              </div>
              <button onClick={handleSettleUp} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Settle Up
              </button>
            </div>
            <p className="text-gray-600">
              You owe <span className="font-bold"><FontAwesomeIcon icon={faDollarSign} className="mr-1" />{billSummary.youOwe}</span> and friends owe you{" "}
              <span className="font-bold"><FontAwesomeIcon icon={faDollarSign} className="mr-1" />{billSummary.theyOwe}</span>.
            </p>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Activity</h2>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map(activity => (
                <li key={activity.id} className="py-4 flex justify-between items-center">
                  <span>
                    {activity.description} - <span className="font-semibold">-<FontAwesomeIcon icon={faDollarSign} className="mr-1" />{activity.amount}</span>
                  </span>
                  <button onClick={() => handleRemind(activity.id)} className="text-green-600 hover:underline">Remind</button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Friends Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Friends</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FriendCard name="Alice" />
            <FriendCard name="Bob" />
            <FriendCard name="Charlie" />
            <FriendCard name="Dana" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
