import React, { useEffect, useState } from 'react';
import {FaVideo, FaComment} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const OnlineAppointmentsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [videoSessions, setVideoSessions] = useState([]);
    const [textSessions, setTextSessions] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');
    const [sessionMode, setSessionMode] = useState('one-on-one');
    const [sessionType, setSessionType] = useState('text-chat');
    const navigate = useNavigate();
    let baseUrl = `http://localhost:3500/bookings/sessionMode`

    useEffect(() => {
      fetchAppointments();
    
      // fetchSessions();
    }, [sessionType, sessionMode]);
    
    const fetchAppointments = async () => {
        try {
            setAppointments([]);
            setIsLoading(true);
            let url = `${baseUrl}/${sessionMode}/sessionType/${sessionType}`;
            const yourAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VySWQiOiI3YmJmMDE4Mi1lY2YxLTQ5MmEtOGFhZS1jNjBhNGNjODliYTUiLCJyb2xlIjoiUGF0aWVudCJ9LCJpYXQiOjE3MTc3ODc1NTcsImV4cCI6MTcxNzg3Mzk1N30.bSCruqGayYNDOoQYSQh8eqqN6x99LQmZUDdZyKQxft8"

            const requestOptions = {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${yourAuthToken}`, // Replace yourAuthToken with your actual token
                  'Content-Type': 'application/json'
              }
          };
          
            const response = await fetch(url, requestOptions);
              
            if(response.ok) {
              const data = await response.json();
              setAppointments(data);
            } else if (response.status === 204) {
                // Handle the case when no appointments are found
                setAppointments([]);
            } else if (response.status === 400){
              errorMessages = await response.json();
              setErrorMessages(errorMessages);
            } else {
              errorMessages = await response.json();
              setErrorMessages(errorMessages);
            }
            console.log(appointments)
        } catch (error) {
          setErrorMessages('Failed to fetch administrator');
        } finally {
          setIsLoading(false)
        }

    };

    const fetchTextSessions = async () => {
      try {
        setTextSessions([]);
        let url;
         
        `${baseUrl}/`
      } catch {

      }
    }

    const fetchVideoSessions = async () => {
      try {
        setVideoSessions([]);
      } catch {

      }
    }





  const handleSessionTypeChange = (sessionType) => {
    setSessionType(sessionType);
  };

  const handleSessionModeChange = (sessionMode) => {
    setSessionMode(sessionMode)
  }

  const createTextSession = (appointment) =>{

  }

  const createVideoSession = (appointment) =>{

  }

  return (
    <div id='onlineAppointmentPage'>
      <h1>Appointments</h1>
      <div id='onlineAppointmentPageContainer'>
      <div className="button-group">
            <button
              className={sessionType === 'text-chat' ? 'selected' : ''}
              onClick={() => handleSessionTypeChange('text-chat')}
            >
              Text
            </button>
            <button
              className={sessionType === 'video-chat' ? 'selected' : ''}
              onClick={() => handleSessionTypeChange('video-chat')}
            >
              Video
            </button>
          </div>
          <div className="button-group">
            <button
              className={sessionMode === 'one-on-one' ? 'selected' : ''}
              onClick={() => handleSessionModeChange('one-on-one')}
            >
              One on One
            </button>
            <button
              className={sessionMode === 'group' ? 'selected' : ''}
              onClick={() => handleSessionModeChange('group')}
            >
              Group
            </button>
          </div>
        
        {isLoading ? ( 
          <ClipLoader id="onlineAppointmentPageSpinner" color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" data-testid="loader" />
        ) : appointments.length === 0 ? (
          <p style={{margin: 20}}>No appointments available</p>
        ) : (
            <div className="appointments-container"> 
              {appointments.map((appointment) => (
                <div key={appointment.bookingId} className="appointment-box">          
                  <p className='therapist-info'><span>Therapist:</span> {appointment.therapistName}</p>
                    { appointment.patientInfo.map((patientInfo, index) => (
                        <div className='patient-info' key={patientInfo.id || index}>
                        <p><span>Patient name:</span> {patientInfo.name}</p>
                        </div>
                    )
                )
                    }
                  <p className='date-info'><span>Date:</span> {appointment.date}</p>
                  <p className='time-info'><span>Time:</span> {appointment.timeSlot}</p>
                  <p className='sessionType-info'><span>TherapistSession Type:</span> {appointment.sessionType}</p>
                  <p className='sessionMode-info'><span>TherapistSession Mode:</span> {appointment.sessionMode}</p>
                  {appointment.isCanceled && 
                  <div>
                    <p>Canceled</p>
                    <p>Canceled by {appointment.canceledBy}</p>
                  </div>} 
                  <div className='buttons'>           
                    <div className='session-buttons'>
                      <button onClick={ () => createTextSession(appointment) } ><FaComment /></button>
                      <button onClick={ () => createVideoSession(appointment) } ><FaVideo /></button>
                    </div>
                  </div>
                    <button id='cancel-appointment-btn'>Cancel Appointment</button>
                    
                  </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default OnlineAppointmentsPage;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AppointmentsPage = ({ userId }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [videoSessions, setVideoSessions] = useState([]);
//   const [textSessions, setTextSessions] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     fetchAppointments();
//     fetchSessions();
//   }, [filter]);
  
//   const fetchAppointments = async () => {
//     try {
//     setIsLoading(true);
//     let url = `http://localhost:3500/bookings/user/group/${userId}`;
//     if (filter !== 'all') {
//         url = `http://localhost:3500/bookings/user/group/${filter}/${userId}`
//     }
//     const response = await fetch(url);

//       // Check if the response status is 204
//     if (response.status === 204) {
//         // Handle the case when no appointments are found
//         setAppointments([]);
//         setIsLoading(false);
//         return;
//     }
//       const data = await response.json();
//       setAppointments(data);
//       console.log(data)
//       setIsLoading(false);
      
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       setIsLoading(false);
//     }
//   };

//   const fetchSessions = async () => {
//     try {
//       const videoResponse = await fetch(`http://localhost:3500/sessions/video-sessions/user/${userId}`);
//       const videoData = await videoResponse.json();
//       setVideoSessions(videoData);
      
      

//       const textResponse = await fetch(`http://localhost:3500/sessions/text-sessions/user/${userId}`);
//       const textData = await textResponse.json();
//       setTextSessions(textData);
     
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const createSession = async (type, patientInfo, therapistId) => {
//     try {
//       const url = type === 'video' ? 'http://localhost:3500/sessions/video-sessions' : 'http://localhost:3500/sessions/text-sessions';
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patientInfo,
//           therapistId,
//           sessionStartTime: new Date().toISOString(),
//         }),
//       });

//       if (response.ok) {
//         const { therapySession } = await response.json();
//         console.log(therapySession)
//         console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} session created successfully`);
//         return therapySession._sessionId;
//       } else {
//         console.error(`Failed to create ${type} session`);
//         return null;
//       }
//     } catch (error) {
//       console.error(`Error creating ${type} session:`, error);
//       return null;
//     }
//   };

//   const getSessionId = (type, appointment) => {
//     const sessions = type === 'video' ? videoSessions : textSessions;
//     const session = sessions.find(session =>
//       session.therapistId === appointment.therapistId &&
//       session.patientId === appointment.patientId
//     );
//     return session ? session.sessionId : null;
//   };

//   const handleJoinChat = async (type, appointment) => {
//     let sessionId = getSessionId(type, appointment);
//     if (!sessionId) {
//         console.log('hi')
//       sessionId = await createSession(type, appointment.patientInfo, appointment.therapistId);
//     }
//     console.log(sessionId);
//     if (sessionId) {
//       navigate(`/room/${type}/${sessionId}`);
//     }

//     else{
        
    
//     }
//   };

//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter);
//   };

//   return (
//     <div>
//       <h1>Appointments</h1>
//       <div>
//         <button onClick={() => handleFilterChange('all')}>All Appointments</button>
//         <button onClick={() => handleFilterChange('text-chat')}>Text Chat Appointments</button>
//         <button onClick={() => handleFilterChange('video-chat')}>Video Chat Appointments</button>
//       </div>
//       {isLoading ? ( 
//         <p>Loading...</p>
//       ) : appointments.length === 0 ? (
//         <p>No appointments found.</p>
//       ) : (
//         <ul>
//           {appointments.map((appointment) => (
//             <li key={appointment.bookingId}>
//                 { appointment.patientInfo.map((patientInfo) => (
//                     <div>
//                     <p>Patient: {patientInfo.name}</p>
//                     <p>Patient: {patientInfo.id}</p>
//                     </div>
//                 )
//             )
//                 }
//               <p>Date: {appointment.date}</p>
//               <p>Time: {appointment.timeSlot}</p>
//               <button onClick={() => handleJoinChat('video', appointment)}>Join Video Chat</button>
//               <button onClick={() => handleJoinChat('text', appointment)}>Join Text Chat</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AppointmentsPage;


  // const fetchSessions = async () => {
  //   try {
  //     const videoResponse = await fetch(`http://localhost:3500/sessions/video-sessions/user/${userId}`);
  //     const videoData = await videoResponse.json();
  //     setVideoSessions(videoData);
      
      

  //     const textResponse = await fetch(`http://localhost:3500/sessions/text-sessions/user/${userId}`);
  //     const textData = await textResponse.json();
  //     setTextSessions(textData);
     
  //   } catch (error) {
  //     console.error('Error fetching sessions:', error);
  //   }
  // };

  // const createSession = async (type, patientInfo, therapistId) => {
  //   try {
  //     const url = type === 'video' ? 'http://localhost:3500/sessions/video-sessions' : 'http://localhost:3500/sessions/text-sessions';
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         patientInfo,
  //         therapistId,
  //         sessionStartTime: new Date().toISOString(),
  //       }),
  //     });

  //     if (response.ok) {
  //       const { therapySession } = await response.json();
  //       console.log(therapySession)
  //       console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} session created successfully`);
  //       return therapySession._sessionId;
  //     } else {
  //       console.error(`Failed to create ${type} session`);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(`Error creating ${type} session:`, error);
  //     return null;
  //   }
  // };

  // const getSessionId = (type, appointment) => {
  //   const sessions = type === 'video' ? videoSessions : textSessions;
  //   const session = sessions.find(session =>
  //     session.therapistId === appointment.therapistId &&
  //     session.patientId === appointment.patientId
  //   );
  //   return session ? session.sessionId : null;
  // };

  // const handleJoinChat = async (type, appointment) => {
  //   let sessionId = getSessionId(type, appointment);
  //   if (!sessionId) {
  //       console.log('hi')
  //     sessionId = await createSession(type, appointment.patientInfo, appointment.therapistId);
  //   }
  //   console.log(sessionId);
  //   if (sessionId) {
  //     navigate(`/room/${type}/${sessionId}`);
  //   }

  //   else{
        
    
  //   }
  // };