import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Reg.css';

const Reg = () => {
    let [data, setData] = useState({ "email": "", "name": "", "password": "", "role": "" });
    let [msg, setMsg] = useState("");
    const [roleOpen, setroleOpen] = useState(false);
    let navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDropdownSelect = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
        setroleOpen(false);
    };

    let add = (e) => {
        e.preventDefault();
        if (data.name !== "" && data.email !== "" && data.password !== "" && data.role !== "") {
            axios.post("http://localhost:5000/Register", data)
                .then((res) => {
                    setMsg(res.data.msg);
                    if (res.data.msg === "Account created") {
                        navigate('/Login');
                    }
                })
                .catch(err => {
                    setMsg("Error during registration");
                    console.error("Registration error:", err);
                });
        } else {
            setMsg("Fill all fields");
        }
    };

    return (
        <div className="reg-container">
            <div className="form-side">
                <div className="join-container">
                    <h2 style={{ "paddingBottom": "20px", "fontWeight": "bold", "color": "black" }}>User Registration</h2>
                    <form className="form-container" onSubmit={add}>
                        <input type="email" placeholder="Enter Email" name="email" value={data.email} onChange={handleChange} required />
                        <input type="text" placeholder="Enter First Name" name="name" value={data.name} onChange={handleChange} required />
                        <input type="password" placeholder="Enter Password" name="password" value={data.password} onChange={handleChange} required />

                        <div className="dropdown">
                            <div className="dropdown-header" onClick={() => setroleOpen(!roleOpen)}>
                                {data.role ? `Role us via: ${data.role}` : "Select Role"}
                            </div>
                            {roleOpen && (
                                <div className="dropdown-content">
                                    <p onClick={() => handleDropdownSelect("role", "Developer")}>Developer</p>
                                </div>
                            )}
                        </div>
                        <button type="submit">Register</button>
                        {msg && <h2 className="message">{msg}</h2>}
                    </form>
                </div>
            </div>
            <div className="image-side"></div>
        </div>
    );
}

export default Reg;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../css/Reg.css';

// const Reg = () => {
//     let [data, setData] = useState({ "email": "", "name": "", "password": "", "role": "" }); 
//     let [msg, setMsg] = useState("");
//     const [roleOpen, setroleOpen] = useState(false);
//     let navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setData((prev) => ({ ...prev, [name]: value }));
//     };

//     // Function to set dropdown values
//     const handleDropdownSelect = (name, value) => {
//         setData((prev) => ({ ...prev, [name]: value }));
//         setroleOpen(false);
//     };

//     let add = (e) => {
//         e.preventDefault(); // Prevent default form submission
//         if (data.name != "" && data.email != "" && data.password != "" && data.role != "") {
//             axios.post("http://localhost:5000/Register", data).then((res) => {
//                 setMsg(res.data.msg);
//                 if (res.data.msg === "Account created") { // Corrected the condition
//                     navigate('/Login');
//                 }
//             }).catch(err => {
//                 setMsg("Error during registration");
//                 console.error("Registration error:", err); // Log the error for debugging
//             });
//         } else {
//             setMsg("Fill all fields"); // Corrected the message
//         }
//     }

//     return (
//         <div className='return'>
//             <div className="join-container">
//                 <h2 style={{ "paddingBottom": "20px", "fontWeight": "bold", "color": "darkred" }}>User Registration</h2>
//                 <form className="form-container" onSubmit={add}> {/* Added onSubmit handler */}

//                     <input type="email" placeholder="Enter Email" name="email" value={data.email} onChange={handleChange} required />

//                     <input type="text" placeholder="Enter First Name" name="name" value={data.name} onChange={handleChange} required /> {/* Changed name to name */}

//                     <input type="password" placeholder="Enter Password" name="password" value={data.password} onChange={handleChange} required /> {/* Changed type to password */}

//                     {/* Accordion: Role */}
//                     <div className="dropdown">
//                         <div className="dropdown-header" onClick={() => setroleOpen(!roleOpen)}>
//                             {data.role ? `Role us via: ${data.role}` : "Select Role"}
//                         </div>
//                         {roleOpen && (
//                             <div className="dropdown-content">
//                                 <p onClick={() => handleDropdownSelect("role", "User")}>User</p>
//                                 <p onClick={() => handleDropdownSelect("role", "Developer")}>Developer</p>
//                                 <p onClick={() => handleDropdownSelect("role", "Manager")}>Manager</p>
//                                 <p onClick={() => handleDropdownSelect("role", "Lead")}>Lead</p>
//                                 <p onClick={() => handleDropdownSelect("role", "Admin")}>Admin</p>
//                             </div>
//                         )}
//                     </div>
//                     <button type="submit">Register</button> {/* Corrected the condition */}
//                     {msg && <h2 className="message">{msg}</h2>}
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Reg;



// import React, { useState } from 'react'
// import axios from 'axios'
// import {useNavigate} from 'react-router-dom'
// import './Reg.css'

// const Reg = () => {

//     let [data,setData] = useState({"email":"","name":"","password":"","role":""})
//     let [msg,setMsg] = useState("")
//     const [roleOpen, setroleOpen] = useState(false);
//     let navigate = useNavigate()
    
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setData((prev) => ({ ...prev, [name]: value }));
//       };

//       // Function to set dropdown values
//   const handleDropdownSelect = (name, value) => {
//     setData((prev) => ({ ...prev, [name]: value }));
//     setroleOpen(false);
//   };

//   let add = () => {
//     if ( data.name!="" && data.email!="" && data.password!="" && data.role!=""){
//         axios.post("http://localhost:5000/Register",data).then((res)=>{
//             setMsg(res.data.msg)
//             if (res.data.msg=="Account is created")
//             {
//                 navigate('/Login')
//             }
//         })
//     }
//     else{
//         setMsg("Fill all feilds")
//     }
// }

//   return (
//     <div className='return'>
//     <div className="join-container">
//       <h2 style={{"padding-bottom":"20px","font-weight": "bold","color":"darkred"}}>User Registration</h2>
//       <form className="form-container">

//         <input type="email" placeholder="Enter Email" name="email" value={data.email} onChange={handleChange} required />

//         <input type="text" placeholder="Enter First Name" name="fname" value={data.fname} onChange={handleChange} required />

//         <input type="tel" placeholder="Enter Password" name="password" value={data.password} onChange={handleChange} required />

//         {/* Accordion: Role */}
//         <div className="dropdown">
//           <div className="dropdown-header" onClick={() => setroleOpen(!roleOpen)}>
//             {data.role ? `Role us via: ${data.role}` : "Select Role"}
//           </div>
//           {roleOpen && (
//             <div className="dropdown-content">
//               <p onClick={() => handleDropdownSelect("role", "User")}>Admin</p>
//               <p onClick={() => handleDropdownSelect("role", "Developer")}>Developer</p>
//               <p onClick={() => handleDropdownSelect("role", "Manager")}>Manager</p>
//               <p onClick={() => handleDropdownSelect("role", "Lead")}>Lead</p>
//               <p onClick={() => handleDropdownSelect("role", "User")}>User</p>
//             </div>
//           )}
//         </div>
//         <button type="submit" onClick={add}>Register</button>
//         {msg && <h2 className="message">{msg}</h2>}
//         </form>
//     </div>
//     </div>
//   )
//   }

// export default Reg
