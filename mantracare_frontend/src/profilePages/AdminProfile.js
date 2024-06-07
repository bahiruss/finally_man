import React, { useState, useEffect } from 'react';

const AdminPage = ({ adminId }) => {
  const [administrator, setAdministrator] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAdministrator = async () => {
      try {
        const response = await fetch(`http://localhost:3500/administrators/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setAdministrator(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Administrator not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch administrator');
        }
      } catch (error) {
        console.error('Error fetching administrator:', error.message);
        setErrorMessage('Failed to fetch administrator');
      }
    };
    fetchAdministrator();
  }, [adminId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : administrator ? (
        <div>
          <h2>Administrator Information</h2>
          <p>User ID: {administrator.userId}</p>
          <p>Username: {administrator.username}</p>
          <p>Email: {administrator.email}</p>
          <p>Name: {administrator.name}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AdminPage;
