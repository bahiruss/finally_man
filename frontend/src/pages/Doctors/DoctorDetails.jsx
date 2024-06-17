import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const Schedule = () => {
  const { accessToken } = useGlobalState();
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingType, setBookingType] = useState('one-on-one'); // Default to one-on-one booking
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    sessionType: '',
    sessionLocation: ''
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`http://localhost:3500/schedule/therapist/${id}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        const scheduleData = await response.json();
        setSchedule(scheduleData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, accessToken]);

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    try {
      const bookingData = {
        therapistId: id,
        therapistName: schedule?.therapistName,
        date: formData.date,
        timeSlot: formData.timeSlot,
        sessionType: formData.sessionType,
        sessionLocation: formData.sessionLocation,
        sessionMode: bookingType
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      };

      const response = await fetch('http://localhost:3500/createBooking', requestOptions);
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      const data = await response.json();
      console.log('Booking created successfully:', data);
      // Optionally handle success message or redirect
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const switchBookingType = (type) => {
    setBookingType(type);
    // Clear form data when switching booking types
    setFormData({
      date: '',
      timeSlot: '',
      sessionType: '',
      sessionLocation: ''
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md'>
      <h1 className='text-headingColor text-xl font-bold mb-4'>Schedule for Therapist</h1>
      {schedule ? (
        <div className='pr-30'>
          <div className='mb-4'>
            <button
              className={`btn ${bookingType === 'one-on-one' ? 'bg-primaryColor text-white' : ''}`}
              onClick={() => switchBookingType('one-on-one')}
            >
              Book One-on-One Appointment
            </button>
            <button
              className={`btn ${bookingType === 'group' ? 'bg-primaryColor text-white' : ''} ml-2`}
              onClick={() => switchBookingType('group')}
            >
              Book Group Appointment
            </button>
          </div>

          {bookingType === 'one-on-one' && (
            <form onSubmit={handleBookingSubmit}>
              <div className='flex flex-col mb-4'>
                <label htmlFor='date' className='text-headingColor font-semibold mb-2'>Date:</label>
                <input
                  type='date'
                  id='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor='timeSlot' className='text-headingColor font-semibold mb-2'>Time Slot:</label>
                <select
                  id='timeSlot'
                  name='timeSlot'
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                >
                  <option value=''>Select Time Slot</option>
                  {schedule.oneOnOneAvailability.map((availability, index) => (
                    availability.timeSlots.map((slot, slotIndex) => (
                      <option key={`${index}-${slotIndex}`} value={slot}>
                        {slot}
                      </option>
                    ))
                  ))}
                </select>
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor='sessionType' className='text-headingColor font-semibold mb-2'>Session Type:</label>
                <input
                  type='text'
                  id='sessionType'
                  name='sessionType'
                  value={formData.sessionType}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor='sessionLocation' className='text-headingColor font-semibold mb-2'>Session Location:</label>
                <select
                  id='sessionLocation'
                  name='sessionLocation'
                  value={formData.sessionLocation}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                >
                  <option value=''>Select Session Location</option>
                  <option value='online'>Online</option>
                  <option value='in-person'>In-Person</option>
                </select>
              </div>

              <button type='submit' className='btn bg-primaryColor text-white px-4 py-2 rounded-md mt-4'>
                Book One-on-One Appointment
              </button>
            </form>
          )}

          {bookingType === 'group' && (
            <form onSubmit={handleBookingSubmit}>
              <div className='flex flex-col mb-4'>
                <label htmlFor='date' className='text-headingColor font-semibold mb-2'>Date:</label>
                <input
                  type='date'
                  id='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor='timeSlot' className='text-headingColor font-semibold mb-2'>Time Slot:</label>
                <select
                  id='timeSlot'
                  name='timeSlot'
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                >
                  <option value=''>Select Time Slot</option>
                  {schedule.groupAvailability.map((group, index) => (
                    group.timeSlots.map((slot, slotIndex) => (
                      <option key={`${index}-${slotIndex}`} value={slot}>
                        {slot}
                      </option>
                    ))
                  ))}
                </select>
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor='sessionType' className='text-headingColor font-semibold mb-2'>Session Type:</label>
                <input
                  type='text'
                  id='sessionType'
                  name='sessionType'
                  value={formData.sessionType}
                  onChange={handleInputChange}
                  required
                  className='border-b border-solid border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-primaryColor'
                />
              </div>

              <button type='submit' className='btn bg-primaryColor text-white px-4 py-2 rounded-md mt-4'>
                Book Group Appointment
              </button>
            </form>
          )}
        </div>
      ) : (
        <p>No schedule found for this therapist.</p>
      )}
    </div>
  );
};

export default Schedule;
