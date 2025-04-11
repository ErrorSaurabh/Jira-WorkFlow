import React, { useContext, useEffect } from 'react';
import Ct from './Ct';
import '../css/Profile.css';

const Profile = ({ isOpen, onClose, onLogout }) => {
    const { userData } = useContext(Ct);

    const getRandomImageUrl = () => {
        const imageId = Math.floor(Math.random() * 1000);
        return `https://picsum.photos/id/${imageId}/100/100`;
    };

    // Close the popup when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('user-profile-popup')) {
                onClose();
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="user-profile-popup">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>

                <div className="avatar-container">
                    <img src={getRandomImageUrl()} alt="Profile" className="avatar" />
                </div>

                <div className="user-info">
                    {userData && <p className="name">{userData.name}</p>}
                    {userData && <p className="role">{userData.role}</p>}
                </div>

                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;


// import React, { useContext } from 'react';
// import Ct from './Ct';
// import '../css/Profile.css';

// const Profile = ({ isOpen, onClose, onLogout }) => {
//     const { userData } = useContext(Ct);

//     const getRandomImageUrl = () => {
//         const imageId = Math.floor(Math.random() * 1000);
//         return `https://picsum.photos/id/${imageId}/100/100`;
//     };

//     if (!isOpen) {
//         return null;
//     }

//     return (
//         <div className="user-profile-popup">
//             <div className="popup-content">
//                 <button className="close-button" onClick={onClose}>
//                     &times;
//                 </button>

//                 <div className="avatar-container">
//                     <img src={getRandomImageUrl()} alt="Profile" className="avatar" />
//                 </div>

//                 <div className="user-info">
//                     {userData && <p className="name">{userData.name}</p>}
//                     {userData && <p className="role">{userData.role}</p>}
//                 </div>

//                 <button className="logout-button" onClick={onLogout}>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Profile;
