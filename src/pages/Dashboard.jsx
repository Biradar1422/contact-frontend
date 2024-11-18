import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [registers, setRegisters] = useState([]);
  const [filteredRegisters, setFilteredRegisters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegisterId, setEditingRegisterId] = useState(null);
  const [newRegister, setNewRegister] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
  });

  useEffect(() => {
    const fetchRegisters = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/v1/register');
        setRegisters(response.data);
        setFilteredRegisters(response.data);
      } catch (error) {
        console.error('Error fetching registers:', error);
      }
    };
    fetchRegisters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/register/${id}`);
      setRegisters(registers.filter((register) => register._id !== id));
      setFilteredRegisters(filteredRegisters.filter((register) => register._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  const handleEdit = (id) => {
    const registerToEdit = registers.find(register => register._id === id); // Find the register to edit
    if (registerToEdit) {
      setEditingRegisterId(registerToEdit._id); // Set the register ID for editing
      setNewRegister({
        name: registerToEdit.name,
        dateOfBirth: registerToEdit.dateOfBirth,
        email: registerToEdit.email,
      });
      setIsModalOpen(true); // Open the modal to edit the register
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/v1/register/${editingRegisterId}`, newRegister);
      setRegisters(registers.map((register) =>
        register._id === editingRegisterId ? { ...register, ...newRegister } : register
      ));
      setFilteredRegisters(filteredRegisters.map((register) =>
        register._id === editingRegisterId ? { ...register, ...newRegister } : register
      ));
      toast.success('User updated successfully!');
      setIsModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user. Please try again.');
    }
  };

  const totalPages = Math.ceil(filteredRegisters.length / itemsPerPage);
  const currentRegisters = filteredRegisters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container">
      <div className="content-area px-6">
        <h4 className="heading text-2xl font-semibold mb-4">Registered Users</h4>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-400 text-white font-mono">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Updated At</th>
              <th className="border border-gray-300 px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {currentRegisters.map((register) => (
              <tr key={register._id} className="hover:bg-gray-100 text-center">
                <td className="border border-gray-300 px-4 py-2">{register.name}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(register.dateOfBirth).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{register.email}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(register.createdAt).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(register.updatedAt).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(register._id)}
                    className="flex items-center rounded-2xl text-white bg-blue-600 hover:bg-blue-400 px-3 py-1 focus:outline-none focus:ring-2 transition ease-in-out duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(register._id)}
                    className="flex items-center rounded-2xl text-white bg-red-900 hover:bg-red-700 px-3 py-1 focus:outline-none focus:ring-2 transition ease-in-out duration-200"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl mb-4">Edit User</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newRegister.name}
                  onChange={(e) => setNewRegister({ ...newRegister, name: e.target.value })}
                  className="border rounded w-full px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={newRegister.dateOfBirth}
                  onChange={(e) => setNewRegister({ ...newRegister, dateOfBirth: e.target.value })}
                  className="border rounded w-full px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newRegister.email}
                  onChange={(e) => setNewRegister({ ...newRegister, email: e.target.value })}
                  className="border rounded w-full px-4 py-2"
                />
              </div>
              <div className="flex justify-between">
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <span>{`Showing ${currentPage * itemsPerPage - itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredRegisters.length)} of ${filteredRegisters.length} entries`}</span>
          <div>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn px-4 py-1 rounded border focus:outline-none"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`btn ml-2 px-4 py-1 ${currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-white'} rounded border hover:bg-gray-200 focus:outline-none`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn ml-2 px-4 py-1 rounded border focus:outline-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
