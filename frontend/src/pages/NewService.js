import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceAPI, hospitalAPI } from '../services/api';
import Layout from '../components/Layout';

const NewService = () => {
  const [formData, setFormData] = useState({
    hospital_id: '',
    patient_name: '',
    patient_number: '',
    service_date: '',
    days_of_service: 1,
    amount_charged: '',
    anesthesia_type: '',
    medication_used: ''
  });
  const [file, setFile] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [newHospitalName, setNewHospitalName] = useState('');
  const [showNewHospital, setShowNewHospital] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const anesthesiaTypes = [
    'General Anesthesia',
    'Regional Anesthesia',
    'Local Anesthesia',
    'Sedation',
    'Spinal Anesthesia',
    'Epidural Anesthesia'
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await hospitalAPI.getAll();
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddHospital = async () => {
    if (!newHospitalName.trim()) return;

    try {
      const newHospital = await hospitalAPI.create(newHospitalName);
      setHospitals([...hospitals, newHospital]);
      setFormData({ ...formData, hospital_id: newHospital.id });
      setNewHospitalName('');
      setShowNewHospital(false);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to add hospital');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await serviceAPI.create(formData, file);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">New Service Entry</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital *
              </label>
              <div className="flex space-x-2">
                <select
                  name="hospital_id"
                  required
                  className="input-field flex-1"
                  value={formData.hospital_id}
                  onChange={handleChange}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewHospital(!showNewHospital)}
                  className="btn-secondary"
                >
                  Add New
                </button>
              </div>

              {showNewHospital && (
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Hospital name"
                    className="input-field flex-1"
                    value={newHospitalName}
                    onChange={(e) => setNewHospitalName(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddHospital}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="patient_name"
                  required
                  className="input-field"
                  value={formData.patient_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Number *
                </label>
                <input
                  type="text"
                  name="patient_number"
                  required
                  className="input-field"
                  placeholder="ID/Phone/Unique No."
                  value={formData.patient_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Date *
                </label>
                <input
                  type="date"
                  name="service_date"
                  required
                  className="input-field"
                  value={formData.service_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Service *
                </label>
                <input
                  type="number"
                  name="days_of_service"
                  required
                  min="1"
                  className="input-field"
                  value={formData.days_of_service}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Charged *
                </label>
                <input
                  type="number"
                  name="amount_charged"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.amount_charged}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Anesthesia *
                </label>
                <select
                  name="anesthesia_type"
                  required
                  className="input-field"
                  value={formData.anesthesia_type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  {anesthesiaTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication Used
              </label>
              <textarea
                name="medication_used"
                rows="3"
                className="input-field"
                placeholder="List medications used (optional)"
                value={formData.medication_used}
                onChange={handleChange}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Bill (PDF/Image)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="input-field"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewService;