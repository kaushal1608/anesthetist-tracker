import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, serviceAPI, exportAPI } from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_revenue: 0,
    total_services: 0,
    total_hospitals: 0
  });
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, servicesData] = await Promise.all([
        dashboardAPI.getStats(),
        serviceAPI.getAll()
      ]);
      
      setStats(statsData);
      // Get last 5 services
      setRecentServices(servicesData.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      await exportAPI.exportToExcel();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.total_patients,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.total_revenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Total Services',
      value: stats.total_services,
      icon: '🏥',
      color: 'bg-purple-500'
    },
    {
      title: 'Hospitals',
      value: stats.total_hospitals,
      icon: '🏢',
      color: 'bg-orange-500'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleExportAll}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Export All Data</span>
            </button>
            <Link to="/services/new" className="btn-primary flex items-center space-x-2">
              <span>➕</span>
              <span>New Service</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white text-2xl mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Services */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Services</h2>
            <Link to="/services" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          {recentServices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No services recorded yet.</p>
              <Link to="/services/new" className="text-primary-600 hover:text-primary-700 font-medium">
                Add your first service →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anesthesia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.patient_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {service.patient_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.hospital_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(service.service_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${service.amount_charged.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.anesthesia_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;