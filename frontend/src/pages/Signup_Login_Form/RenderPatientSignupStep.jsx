import React, { useState } from 'react';
import PasswordInput from '../PasswordInput/PasswordInput';
import 'react-toastify/dist/ReactToastify.css';
import './Signup_Login_Form.css';
import { FaUser,FaKey} from "react-icons/fa";
import {BsCalendarDate} from "react-icons/bs"
import { FaMobileScreen } from "react-icons/fa6";
import { GrMail } from "react-icons/gr";
import 'react-toastify/dist/ReactToastify.css';
import IconComponent from '../IconComponent/IconComponent';

const RenderSignupStep = ({username, email, password, name, dob, profilePic, phoneNumber, setUsername, setEmail, setPassword, setName, setDob, setProfilePic, setPhoneNumber, signupStep, handleNextStep, handlePrevStep, confirmPassword, setConfirmPassword, handlePatientRegistration}) => {
    switch (signupStep) {
      case 1:
        return (
          <>
            <div className="input-field">
              <i><FaUser /></i>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-field">
              <i><GrMail /></i>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <PasswordInput password={password} setPassword={setPassword} placeholder={"Password"} />
            <PasswordInput password={password} setPassword={setPassword} placeholder={" Conform Password"} />


            {/* <div className="input-field focus:ring-0">
                <li className='pass'><FaLock/></li>
              <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
            </div> */}
            <div className="buttons">
              <button className=" btn1" type="button" onClick={handleNextStep}>Next</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="input-field">
            <i><FaUser /></i>
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
            </div>
            <div className="input-field">
            <i><FaMobileScreen /></i>
              <input type="tel" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
            </div>
            <div className="input-field">
            <i><BsCalendarDate /></i>
              <input type="date" name="dateOfBirth" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div className="buttons">
              <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
              <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className='input-fields'>
                <label htmlFor="profile-picture" className='input-field mt-6 '>Profile Picture</label>
              <input id='profile-picture' type="file" className=' ld input-field mb-9' name="profilePic" onChange={(e) => setProfilePic(e.target.files[0])} required />
            </div>
           
            <div className="buttons mt-5">
              <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
              <button className="btn1" type="submit" onClick={handlePatientRegistration}>Sign Up</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

export default RenderSignupStep;