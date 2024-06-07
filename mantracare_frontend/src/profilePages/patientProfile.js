import React, { useState, useEffect } from 'react';

const PatientProfile = ({ patientId }) => {
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
          <p>Password: {patient.password}</p>
          <p>Email: {patient.email}</p>
          <p>Name: {patient.name}</p>
          <p>Date of Birth: {patient.dateOfBirth}</p>
          <p>Phone Number: {patient.phoneNumber}</p>
          <p>Registration Date: {patient.registrationDate}</p>
          <p>Profile Picture: {patient.profilePic}</p>
          <p>Patient ID: {patient.patientId}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PatientProfile;
