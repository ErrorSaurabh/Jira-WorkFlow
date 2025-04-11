import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Component/logo.png';
import Ct from './Ct';
import Avatar from '@mui/material/Avatar';
import Profile from './Profile';


const Nav = () => {
    const { userData } = useContext(Ct);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const isManager = userData?.role === 'Manager';
    const isDeveloper = userData?.role === 'Developer';
    const isLoggedIn = userData?.token;

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        navigate('/logout'); 
        toggleProfile(); 
    };

    return (
        <div className='header'>
            <div className='logo'>
                <img src={logo} alt="Logo" />
                <p>Jira Work Management</p>
            </div>

            <nav className='nav'>
                <Link to='/'>Home</Link>
                <Link to='/guide'>Guide</Link>
                {isLoggedIn && isManager && (
                    <>
                        <Link to='/Create'>Create</Link>
                        <Link to='/Projects'>Projects</Link>
                        <Link to='/Report'>Report</Link>
                        <Link to='/Dashboards'>Dashboards</Link>
                        <Link to='/ProjectList'>ProjectList</Link>
                    </>
                )}
                {isLoggedIn && isDeveloper && (
                    <>
                        <Link to='/ProjectList'>ProjectList</Link>
                        <Link to='/Dashboards'>Dashboards</Link>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <div className='Avatar-container' onClick={toggleProfile}>
                            <Avatar src="/broken-image.jpg" className='Avatar' />
                        </div>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <Link to='/Login'>Login</Link>
                        <Link to='/Register'>Registration</Link>
                    </>
                )}
                {isLoggedIn && (
                    <Profile isOpen={isProfileOpen} onClose={toggleProfile} onLogout={handleLogout} />
                )}
            </nav>
        </div>
    );
};

export default Nav;