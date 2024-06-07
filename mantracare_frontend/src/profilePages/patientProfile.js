import React, { useState, useEffect } from 'react';

const PatientPage = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:3500/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Patient not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch patient');
        }
      } catch (error) {
        console.error('Error fetching patient:', error.message);
        setErrorMessage('Failed to fetch patient');
      }
    };
    fetchPatient();
  }, [patientId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : patient ? (
        <div>
          <h2>Patient Information</h2>
          <p>User ID: {patient.userId}</p>
          <p>Username: {patient.username}</p>
          <p>Email: {patient.email}</p>
          <p>Name: {patient.name}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PatientPage;
