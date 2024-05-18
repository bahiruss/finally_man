import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentsPage = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [videoSessions, setVideoSessions] = useState([]);
  const [textSessions, setTextSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchAppointments();
    fetchSessions();
  }, [filter]);
  
  const fetchAppointments = async () => {
    try {
    setIsLoading(true);
    let url = `http://localhost:3500/bookings/user/group/${userId}`;
    if (filter !== 'all') {
        url = `http://localhost:3500/bookings/user/group/${filter}/${userId}`
    }
    const response = await fetch(url);

      // Check if the response status is 204
    if (response.status === 204) {
        // Handle the case when no appointments are found
        setAppointments([]);
        setIsLoading(false);
        return;
    }
      const data = await response.json();
      setAppointments(data);
      console.log(data)
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const videoResponse = await fetch(`http://localhost:3500/sessions/video-sessions/user/${userId}`);
      const videoData = await videoResponse.json();
      setVideoSessions(videoData);
      
      

      const textResponse = await fetch(`http://localhost:3500/sessions/text-sessions/user/${userId}`);
      const textData = await textResponse.json();
      setTextSessions(textData);
     
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const createSession = async (type, patientInfo, therapistId) => {
    try {
      const url = type === 'video' ? 'http://localhost:3500/sessions/video-sessions' : 'http://localhost:3500/sessions/text-sessions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientInfo,
          therapistId,
          sessionStartTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const { therapySession } = await response.json();
        console.log(therapySession)
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} session created successfully`);
        return therapySession._sessionId;
      } else {
        console.error(`Failed to create ${type} session`);
        return null;
      }
    } catch (error) {
      console.error(`Error creating ${type} session:`, error);
      return null;
    }
  };

  const getSessionId = (type, appointment) => {
    const sessions = type === 'video' ? videoSessions : textSessions;
    const session = sessions.find(session =>
      session.therapistId === appointment.therapistId &&
      session.patientId === appointment.patientId
    );
    return session ? session.sessionId : null;
  };

  const handleJoinChat = async (type, appointment) => {
    let sessionId = getSessionId(type, appointment);
    if (!sessionId) {
        console.log('hi')
      sessionId = await createSession(type, appointment.patientInfo, appointment.therapistId);
    }
    console.log(sessionId);
    if (sessionId) {
      navigate(`/room/${type}/${sessionId}`);
    }

    else{
        
    
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <h1>Appointments</h1>
      <div>
        <button onClick={() => handleFilterChange('all')}>All Appointments</button>
        <button onClick={() => handleFilterChange('text-chat')}>Text Chat Appointments</button>
        <button onClick={() => handleFilterChange('video-chat')}>Video Chat Appointments</button>
      </div>
      {isLoading ? ( 
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.bookingId}>
                { appointment.patientInfo.map((patientInfo) => (
                    <div>
                    <p>Patient: {patientInfo.name}</p>
                    <p>Patient: {patientInfo.id}</p>
                    </div>
                )
            )
                }
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.timeSlot}</p>
              <button onClick={() => handleJoinChat('video', appointment)}>Join Video Chat</button>
              <button onClick={() => handleJoinChat('text', appointment)}>Join Text Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsPage;
