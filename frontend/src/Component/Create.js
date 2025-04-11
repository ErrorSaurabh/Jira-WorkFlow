import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import '../css/Create.css';
import { useNavigate } from 'react-router-dom';


const Create = () => {

    let [data, setdata] = useState({ "name": "", "key": "", "selectedRole": "", "lead": "", "description": "", "members": [] });
    const [leadOpen, setleadOpen] = useState(false);
    let [msg, setmsg] = useState("");
    let navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [memberOpen, setMemberOpen] = useState(false);

    const roles = ["Developer", "Manager"];
    let [selectedRole, setSelectedRole] = useState('');
    let [selectedMembers, setSelectedMembers] = useState([]); 
    const memberDropdownRef = useRef(null);

    useEffect(() => {
        if (selectedRole) {
            axios.get(`http://localhost:5000/user?roles=${selectedRole}`)
                .then(res => {
                    setLeads(res.data);
                })
                .catch(err => {
                    console.error("Error fetching leads:", err);
                });
        }
        axios.get(`http://localhost:5000/user?roles=Developer`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
            });
    }, [selectedRole]);

    let fun = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }

    const handleLeadSelect = (leadId) => {
        const selectedLead = leads.find(lead => lead._id === leadId);
        if (selectedLead) {
            setdata({ ...data, lead: selectedLead._id });
            setleadOpen(false);
        }
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleMemberSelect = (userId) => {
        setSelectedMembers(prevMembers => {
            if (prevMembers.includes(userId)) {
                return prevMembers.filter(id => id !== userId);
            } else {
                return [...prevMembers, userId];
            }
        });
    };

    const toggleMemberDropdown = () => {
        setMemberOpen(!memberOpen);
    };

    useEffect(() => {
        setdata(prevData => ({ ...prevData, members: selectedMembers }));
    }, [selectedMembers]);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target)) {
                setMemberOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [memberDropdownRef]);

    let add = () => {
        if (data.name !== "" && data.key !== "" && data.lead !== "" && data.description !== "") {
            axios.post("http://localhost:5000/project/create", data)
            .then(res => {
                console.log(res)
                setmsg(res.data.msg);
                navigate("/Projects");
            })
            .catch(err => {
                setmsg("Error creating project");
                console.error("Project creation error:", err);
            });
        } else {
            setmsg("Please fill all fields");
        }
    }
    return (
        <div className='return'>
            <div className='create'>
                <div>
                    <h1 className='h1'>Create</h1>
                </div>

                <div className='form'>
                    <input type='text' name='name' onChange={fun} value={data.name} placeholder='Enter Project Name' />
                    <input type='text' name='key' onChange={fun} value={data.key} placeholder='Enter Project Key' />

                    <div>
                        <select id="role" onChange={handleRoleChange} value={selectedRole}>
                            <option value="">Select a Lead By Role</option>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="drop">
                        <div className="head" onClick={() => setleadOpen(!leadOpen)}>
                            {data.lead ? `Lead: ${leads.find(lead => lead._id === data.lead)?.name}` : "Select Lead Name"}
                        </div>
                        {leadOpen && (
                            <div className="down">
                                {leads.map(lead => (
                                    <p key={lead._id} onClick={() => handleLeadSelect(lead._id)} className='p'>
                                        {lead.name}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <input type='text' name='description' onChange={fun} value={data.description} placeholder='Enter Description'  className='desc'/>

                    <div className="drop" ref={memberDropdownRef}>
                        <div className="head" onClick={toggleMemberDropdown}>
                            {selectedMembers.length > 0 ? `Members: ${selectedMembers.length} selected` : "Select Members"}
                        </div>
                        {memberOpen && (
                            <div className="down" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '5px' }}>
                                {users.map(user => (
                                    <label key={user._id} className='p' style={{ display: 'block', padding: '5px' }}>
                                        <input
                                            type="checkbox"
                                            value={user._id}
                                            checked={selectedMembers.includes(user._id)}
                                            onChange={() => handleMemberSelect(user._id)}
                                        />
                                        {user.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={add} className='add'>Submit</button>
                    <div>{msg}</div>
                </div>
            </div>
        </div>
    )
}
export default Create;

