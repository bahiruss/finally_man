import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const Schedule = () => {
const { accessToken } = useGlobalState();
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        console.log('1',response.status)
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        const scheduleData = await response.json();
        console.log(scheduleData)
        setSchedule(scheduleData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md'>
      <h1 className='text-headingColor text-xl font-bold mb-4'>Schedule for Therapist</h1>
      {schedule ? (
        <div className='pr-30'>
          
          <div className='mt-[30px]'>
            <p className='text__para mt-0 font-semibold text-headingColor'>
              Availability Time Slots (one on one):
            </p>
            <ul className='mt-3'>
              {schedule.oneOnOneAvailability.map((availability, index) => (
                <li key={index} className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-[15px] leading-6 text-textColor font-semibold'>
                      {availability.day}
                    </p>
                    <ul>
                      {availability.timeSlots.map((slot, slotIndex) => (
                        <li key={slotIndex} className='text-[15px] leading-6 text-textColor font-semibold'>
                          {slot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-[30px]'>
            <p className='text__para mt-0 font-semibold text-headingColor'>
              Availability Time Slots (group sessions):
            </p>
            <ul className='mt-3'>
              {schedule.groupAvailability.map((group, index) => (
                <li key={index} className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-[15px] align-center leading-6 text-textColor font-semibold'>
                      {group.day}
                    </p>
                    <ul>
                      {group.timeSlots.map((slot, slotIndex) => (
                        <li key={slotIndex} className='text-[15px] block leading-6 text-textColor font-semibold'>
                          {group.title} <br className='align-center'/> ({group.sessionLocation})<br className='align-center justify-center' /> {slot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button className='btn px-2 w-full rounded-md mt-4'>Book Appointment</button>
        </div>
      ) : (
        <p>No schedule found for this therapist.</p>
      )}
    </div>
  );
};

export default Schedule;
