import React, { useState, useEffect } from 'react';

const CustomerAndCrisisSupportPage = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:3500/customerAndCrisisSupport/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setCustomer(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Customer and crisis support not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Missing required fields');
        } else {
          setErrorMessage('Failed to fetch customer and crisis support');
        }
      } catch (error) {
        console.error('Error fetching customer and crisis support:', error.message);
        setErrorMessage('Failed to fetch customer and crisis support');
      }
    };
    fetchCustomer();
  }, [customerId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : customer ? (
        <div>
          <h2>Customer and Crisis Support Information</h2>
          <p>User ID: {customer.userId}</p>
          <p>Username: {customer.username}</p>
          <p>Email: {customer.email}</p>
          <p>Name: {customer.name}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CustomerAndCrisisSupportPage;
