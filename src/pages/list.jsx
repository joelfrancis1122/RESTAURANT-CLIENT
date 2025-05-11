import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [editId, setEditId] = useState(null); // 🔧 new: to store restaurant id while editing
  const [errors, setErrors] = useState({ name: '', address: '', contact: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setErrors((prev) => ({ ...prev, general: 'Failed to load restaurants' }));
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditId(null);
  };

  const handleClose = () => {
    setOpen(false);
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
        await axios.put(`http://localhost:3000/restaurants?id=${editId}`, formData);
        setSuccessMessage('Restaurant updated successfully!');
      } else {
        await axios.post('http://localhost:3000/restaurants', formData);
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
      await axios.delete(`http://localhost:3000/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      contact: restaurant.contact,
    });
    console.log(restaurant.id,"ssssssssssssssssssss")
    setEditId(restaurant.id); // set edit mode
    setOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">Our Restaurants</h1>
          <button
            onClick={handleOpen}
            className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
          >
            <Plus className="w-5 h-5 text-green-700" />
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-green-500 text-white">
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
                    className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                  >
                    <td className="py-3 px-4">{restaurant.name}</td>
                    <td className="py-3 px-4">{restaurant.address}</td>
                    <td className="py-3 px-4 text-right">{restaurant.contact}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="p-1 hover:bg-yellow-100 rounded"
                      >
                        <Pencil className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No restaurants available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? 'Edit Restaurant' : 'Add New Restaurant'}
              </h2>
              {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
              {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Restaurant Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                <input
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
