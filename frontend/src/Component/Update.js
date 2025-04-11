import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const Update = ({ project, onClose, onUpdate }) => {
    const [updatedProject, setUpdatedProject] = useState({ ...project });
    const [leadOpen, setLeadOpen] = useState(false);
    const [memberOpen, setMemberOpen] = useState(false);
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState(project.members || []);
    const [roles, setRoles] = useState(["Developer", "Manager"]);
    const [selectedRole, setSelectedRole] = useState('');

    const memberDropdownRef = useRef(null);
    const leadDropdownRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let url = "http://localhost:5000/user";
                if (selectedRole) {
                    url += `?roles=${selectedRole}`;
                }
                const usersResponse = await axios.get(url);
                console.log("Fetched Users:", usersResponse.data); // Debugging
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [selectedRole]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const leadsResponse = await axios.get(`http://localhost:5000/user?roles=Manager`);
                console.log("Fetched Leads:", leadsResponse.data); // Debugging
                setLeads(leadsResponse.data);
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        };
        fetchLeads();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProject(prevProject => ({ ...prevProject, [name]: value }));
    };

    const handleLeadSelect = (leadId) => {
        console.log("Selected Lead ID:", leadId); 
        setUpdatedProject(prevProject => ({ ...prevProject, lead: leadId }));
        setLeadOpen(false); 
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleMemberSelect = (userId) => {
        setSelectedMembers(prevMembers => {
            let updatedMembers = prevMembers.includes(userId)
                ? prevMembers.filter(id => id !== userId)
                : [...prevMembers, userId];
    
            setUpdatedProject(prevData => ({ ...prevData, members: updatedMembers }));
            return updatedMembers;
        });
    
        setMemberOpen(false); 
    };

    useEffect(() => {
        setUpdatedProject(prevData => ({ ...prevData, members: selectedMembers }));
    }, [selectedMembers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Project:", updatedProject); // Debugging
        onUpdate(updatedProject);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Update Project</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={updatedProject.name || ''} onChange={handleChange} />

                    <label>Key:</label>
                    <input type="text" name="key" value={updatedProject.key || ''} onChange={handleChange} />

                    <label>Description:</label>
                    <textarea name="description" value={updatedProject.description || ''} onChange={handleChange} />

                    {/* Role Selection Dropdown */}
                    <label htmlFor="role">Select Role:</label>
                    <select id="role" className="input-style" onChange={handleRoleChange} value={selectedRole}>
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>

                    {/* Lead Selection */}
                    <label>Lead:</label>
                    <div className="drop" ref={leadDropdownRef}>
                        <div className="head" onClick={() => setLeadOpen(!leadOpen)}>
                            {leads.find(lead => lead._id === updatedProject.lead)?.name || "Select Lead"}
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

                    {/* Members Selection */}
                    <label>Members:</label>
                    <div className="drop" ref={memberDropdownRef}>
                        <div className="head" onClick={() => setMemberOpen(!memberOpen)}>
                            {selectedMembers.length > 0 ? `${selectedMembers.length} selected` : "Select Members"}
                        </div>
                        {memberOpen && (
                            <div className="down scrollable-dropdown">
                                {users.map(user => (
                                    <label key={user._id} className='p'>
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

                    {/* Submit Button */}
                    <button type="submit">Update Project</button>
                </form>
            </div>
        </div>
    );
};

export default Update;