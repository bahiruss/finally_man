import React, { useEffect, useState } from 'react';
import { FaStickyNote } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

const Note = ({ accessToken, username, isNoteLoading, setNoteIsLoading }) => {
  const { roomId } = useParams();
  const [note, setNote] = useState('');
  const [noteList, setNoteList] = useState([]);
  
  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    fetchNotes();
  }, [roomId]);

  const fetchNotes = async () => {
    try {
      setNoteIsLoading(true);
      const url = `${baseUrl}/notes/session/${roomId}`;
      
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, requestOptions);

      if (response.status === 200) {
        const data = await response.json();
        setNoteList(data);
      } else if (response.status === 204) {
        // Do nothing if no notes are found
      } else {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to fetch notes', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setNoteIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch notes', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setNoteIsLoading(false);
    }
  };

  const sendNote = async () => {
    if (note !== '') {
      const noteData = {
        sessionId: roomId,
        note,
        creatorId: username,
        timeStamp: new Date(),
      };

      setNote('');
      setNoteList((prevNoteList) => [...prevNoteList, noteData]);

      try {
        const url = `${baseUrl}/notes`;
        const requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(noteData)
        };

        const response = await fetch(url, requestOptions);

        if (response.status !== 201) {
          const errorMessages = await response.json();
          toast.error(errorMessages.message || 'Failed to send note', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        toast.error('Failed to send note', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className='note-container'>
          <div className='note-body'>
            {noteList.map((note, index) => (
              <div className='note-item' key={index}>
                <p>{note.note}</p>
                <div className='note-date'>
                  {new Date(note.timeStamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className='note-footer'>
            <input
              type="text"
              value={note}
              placeholder="Write a note..."
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendNote();
                }
              }}
            />
            <button onClick={sendNote}>
              <FaStickyNote />
            </button>
          </div>
      
    </div>
  );
};

export default Note;
