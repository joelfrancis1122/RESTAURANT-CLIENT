import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { addRestaurant, deleteRestaurant, getAllRestaurants, updateRestaurant } from '../service/restaurantService';


const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({ name: '', address: '', contact: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRestaurants = async () => {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
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
        await updateRestaurant(editId, formData);
        setSuccessMessage('Restaurant updated successfully!');
      } else {
        await addRestaurant(formData);
        setSuccessMessage('Restaurant added successfully!');
      }
      fetchRestaurants();
      handleClose();
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: 'Failed to save restaurant' }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await deleteRestaurant(id);
      fetchRestaurants();
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: 'Failed to delete restaurant' }));
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      contact: restaurant.contact,
    });
    setEditId(restaurant.id);
    setShowForm(true);
    setErrors({ name: '', address: '', contact: '', general: '' });
    setSuccessMessage('');
  };


  return (
    <div className="dark min-h-screen px-4 sm:px-6 py-10 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center flex-grow">Our Restaurants</h1>
          <button
            onClick={handleOpen}
            className="p-2 bg-green-200 dark:bg-green-700 rounded hover:bg-green-300 dark:hover:bg-green-600"
          >
            <Plus className="w-5 h-5 text-green-800 dark:text-green-100" />
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded shadow w-full max-w-md p-5 mb-8 mx-auto">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
              {editId ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>
            {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}
            <div className="space-y-3">
              <input
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.name ? 'border-red-400' : ''
                  }`}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.address ? 'border-red-400' : ''
                  }`}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

              <input
                type="tel"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                maxLength={10}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, contact: onlyNumbers });
                }}
                className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${errors.contact ? 'border-red-400' : ''
                  }`}
              />

              {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
            </div>
            <div className="flex justify-end mt-5 space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-1.5 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-600"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-600 dark:bg-gray-700 text-white">
                <th className="py-3 px-4 text-left font-medium">Name</th>
                <th className="py-3 px-4 text-left font-medium">Address</th>
                <th className="py-3 px-4 text-right font-medium">Contact</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <tr
                    key={restaurant.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-100">{restaurant.name}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-100">{restaurant.address}</td>
                    <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-100">{restaurant.contact}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="p-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded"
                      >
                        <Pencil className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
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
