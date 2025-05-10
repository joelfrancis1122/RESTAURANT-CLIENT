import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [errors, setErrors] = useState({ name: '', address: '', contact: '', general: '' });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/restaurants');
        console.log(response.data,"sssss")
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        setErrors((prev) => ({ ...prev, general: 'Failed to load restaurants' }));
      }
    };
    fetchRestaurants();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', address: '', contact: '' });
    setErrors({ name: '', address: '', contact: '', general: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
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
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/restaurants', formData);
        console.log(response,"assss")
        setRestaurants((prev) => [...prev, response.data.data]);
        handleClose();
        
      } catch (error) {
        console.error('Failed to add restaurant:', error);
        setErrors((prev) => ({ ...prev, general: 'Failed to add restaurant' }));
      }
    }
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
                <th className="w-1/3 py-3 px-4 text-left font-semibold">Name</th>
                <th className="w-2/5 py-3 px-4 text-left font-semibold">Address</th>
                <th className="w-1/3 py-3 px-4 text-right font-semibold">
                  <div className="flex items-center justify-end">Contact</div>
                </th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Restaurant</h2>
              {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
              <div className="space-y-4">
                <div>
                  <input
                    autoFocus
                    name="name"
                    placeholder="Restaurant Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    name="address"
                    placeholder="Address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <input
                    name="contact"
                    placeholder="Contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
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