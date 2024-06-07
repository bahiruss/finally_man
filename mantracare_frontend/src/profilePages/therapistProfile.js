import React, { useState, useEffect } from 'react';

const TherapistPage = ({ therapistId }) => {
  const [therapist, setTherapist] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await fetch(`http://localhost:3500/therapists/${therapistId}`);
        if (response.ok) {
          const data = await response.json();
          setTherapist(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Therapist not found or not approved');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch therapist');
        }
      } catch (error) {
        console.error('Error fetching therapist:', error.message);
        setErrorMessage('Failed to fetch therapist');
      }
    };
    fetchTherapist();
  }, [therapistId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : therapist ? (
        <div>
          <h2>Therapist Information</h2>
          <p>User ID: {therapist.userId}</p>
          <p>Username: {therapist.username}</p>
          <p>Email: {therapist.email}</p>
          <p>Name: {therapist.name}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TherapistPage;
