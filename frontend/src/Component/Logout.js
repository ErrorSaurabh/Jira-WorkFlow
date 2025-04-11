import React, { useContext, useEffect } from 'react';
import Ct from './Ct'; 
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { updatestate } = useContext(Ct); 
  const navigate = useNavigate(); 
  useEffect(() => {

    updatestate({ "token": "", "_id": "", "name": "", "role": "" });

    localStorage.removeItem('userData');

    navigate("/");
  }, [updatestate, navigate]); 

  return (
    <div>Logout</div>
  );
}

export default Logout;
