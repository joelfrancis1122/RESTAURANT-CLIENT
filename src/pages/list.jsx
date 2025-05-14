import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({ name: '', address: '', contact: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants`);
      setRestaurants(response.data);
      console.log(response.data,"this is the data")
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setErrors((prev) => ({ ...prev, general: 'Failed to load restaurants' }));
    }
  };

  useEffect(() => {
    fetchRestaurants();
      
  }, []);

  const handleOpen = () => {
    setShowForm(true);
    setEditId(null);
    setFormData({ name: '', address: '', contact: '' });
    setErrors({ name: '', address: '', contact: '', general: '' });
    setSuccessMessage('');
  };

  const handleClose = () => {
    setShowForm(false);
    setFormData({ name: '', address: '', contact: '' });
    setErrors({ name: '', address: '', contact: '', general: '' });
    setSuccessMessage('');
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
    setSuccessMessage('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', address: '', contact: '', general: '' };
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/restaurants?id=${editId}`, formData);
        setSuccessMessage('Restaurant updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/restaurants`, formData);
        setSuccessMessage('Restaurant added successfully!');
      }
      fetchRestaurants();
      handleClose();
    } catch (error) {
      console.error('Failed to save restaurant:', error);
      setErrors((prev) => ({ ...prev, general: 'Failed to save restaurant' }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      setErrors((prev) => ({ ...prev, general: 'Failed to delete restaurant' }));
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      contact: restaurant.contact,
    });
    console.log(restaurant.id, "ssssssssssssssssssss");
    setEditId(restaurant.id);
    setShowForm(true);
    setErrors({ name: '', address: '', contact: '', general: '' });
    setSuccessMessage('');
  };
  return (
    <div className="dark min-h-screen px-4 sm:px-6 py-10 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center flex-grow">Our Restaurants</h1>
          <button
            onClick={handleOpen}
            className="p-2 bg-green-100 dark:bg-green-700 rounded-full hover:bg-green-200 dark:hover:bg-green-600 transition-colors"
          >
            <Plus className="w-5 h-5 text-green-700 dark:text-green-100" />
          </button>
        </div>

        {/* Conditionally Rendered Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 mb-8 mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {editId ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>
            {errors.general && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{errors.general}</p>}
            {successMessage && <p className="text-green-500 dark:text-green-400 text-sm mb-4">{successMessage}</p>}
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.name ? 'border-red-500 dark:border-red-400' : ''
                  }`}
              />
              {errors.name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.name}</p>}

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.address ? 'border-red-500 dark:border-red-400' : ''
                  }`}
              />
              {errors.address && <p className="text-red-500 dark:text-red-400 text-sm">{errors.address}</p>}

              <input
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.contact ? 'border-red-500 dark:border-red-400' : ''
                  }`}
              />
              {errors.contact && <p className="text-red-500 dark:text-red-400 text-sm">{errors.contact}</p>}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-green-500 dark:from-gray-700 dark:to-gray-600 text-white">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Address</th>
                <th className="py-3 px-4 text-right font-semibold">Contact</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <tr
                    key={restaurant.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-100">{restaurant.name}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-100">{restaurant.address}</td>
                    <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-100">{restaurant.contact}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded"
                      >
                        <Pencil className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No restaurants available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;