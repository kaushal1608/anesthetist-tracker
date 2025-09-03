import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI, hospitalAPI, exportAPI } from '../services/api';
import Layout from '../components/Layout';

const Services = () => {
  const [services, setServices] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filters, setFilters] = useState({
    hospital_id: '',
    anesthesia_type: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(true);

  const anesthesiaTypes = [
    'General Anesthesia',
    'Regional Anesthesia',
    'Local Anesthesia',
    'Sedation',
    'Spinal Anesthesia',
    'Epidural Anesthesia'
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [servicesData, hospitalsData] = await Promise.all([
        serviceAPI.getAll(),
        hospitalAPI.getAll()
      ]);
      setServices(servicesData);
      setHospitals(hospitalsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceAPI.getAll(filters);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      hospital_id: '',
      anesthesia_type: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleExport = async () => {
    try {
      await exportAPI.exportToExcel(filters);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  const downloadFile = (filename) => {
    if (filename) {
      window.open(`http://localhost:8000/api/files/${filename}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading services...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">All Services</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Export Filtered</span>
            </button>
            <Link to="/services/new" className="btn-primary flex items-center space-x-2">
              <span>➕</span>
              <span>New Service</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital
              </label>
              <select
                name="hospital_id"
                className="input-field"
                value={filters.hospital_id}
                onChange={handleFilterChange}
              >
                <option value="">All Hospitals</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anesthesia Type
              </label>
              <select
                name="anesthesia_type"
                className="input-field"
                value={filters.anesthesia_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {anesthesiaTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                className="input-field"
                value={filters.start_date}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                className="input-field"
                value={filters.end_date}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Services ({services.length})
            </h2>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No services found matching your criteria.</p>
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
                      Service Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anesthesia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
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
                        {service.days_of_service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${service.amount_charged.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {service.anesthesia_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.bill_filename ? (
                          <button
                            onClick={() => downloadFile(service.bill_filename)}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            📄 Download
                          </button>
                        ) : (
                          <span className="text-gray-400">No file</span>
                        )}
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

export default Services;