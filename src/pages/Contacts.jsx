import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon } from '@heroicons/react/24/solid';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', user_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editContact, setEditContact] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/contacts');
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    const results = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(results);
    setCurrentPage(1);
  }, [searchTerm, contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setNewContact({ name: '', email: '', phone: '', user_id: '' });
      setIsOpen(false);
      toast.success('Contact added successfully!');
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Error adding contact. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      setFilteredContacts(filteredContacts.filter((contact) => contact._id !== id));
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Error deleting contact. Please try again.');
    }
  };

  const openEditModal = (contact) => {
    setEditContact(contact);
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditContact({ ...editContact, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/contacts/${editContact._id}`, editContact);
      setContacts(contacts.map((contact) =>
        contact._id === editContact._id ? response.data : contact
      ));
      setIsEditOpen(false);
      toast.success('Contact updated successfully!');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Error updating contact. Please try again.');
    }
  };

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container">
      <div className="content-area px-6">
        <h4 className="heading text-2xl font-semibold mb-4">Manage Contacts</h4>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary rounded-2xl px-4 py-1 bg-violet-600 text-white hover:bg-violet-700 focus:outline-none"
          >
            + Add New Contact
          </button>
        </div>

        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-400 text-white font-mono">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-100 text-center">
                <td className="border border-gray-300 px-4 py-2">{contact.name}</td>
                <td className="border border-gray-300 px-4 py-2">{contact.email}</td>
                <td className="border border-gray-300 px-4 py-2">{contact.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{contact.user_id}</td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="flex items-center rounded-2xl text-white bg-blue-900 hover:bg-blue-700 px-3 py-1 focus:outline-none focus:ring-2 transition ease-in-out duration-200"
                  >
                    <EditOutlined className="h-5 w-5 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
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

        <div className="flex justify-between mt-4">
          <span>{`Showing ${currentPage * itemsPerPage - itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredContacts.length)} of ${filteredContacts.length} entries`}</span>
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

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newContact.email}
                    onChange={handleInputChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleInputChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">User ID</label>
                  <input
                    type="text"
                    name="user_id"
                    value={newContact.user_id}
                    onChange={handleInputChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300 text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditOpen && editContact && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editContact.name}
                    onChange={handleEditChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editContact.email}
                    onChange={handleEditChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editContact.phone}
                    onChange={handleEditChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">User ID</label>
                  <input
                    type="text"
                    name="user_id"
                    value={editContact.user_id}
                    onChange={handleEditChange}
                    className="border rounded w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300 text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                  >
                    Update Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
