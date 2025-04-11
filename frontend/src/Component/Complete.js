import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Complete = () => {
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [completedProjects, setCompletedProjects] = useState([]);
    const [filterType, setFilterType] = useState('lead'); 

    useEffect(() => {
      
        const fetchLeads = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users/leads'); 
                setLeads(response.data);
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/project/all'); 
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchLeads();
        fetchProjects();
    }, []);

    const handleLeadChange = (event) => {
        setSelectedLeadId(event.target.value);
        setFilterType('lead');
        setSelectedProjectId(''); 
    };

    const handleProjectChange = (event) => {
        setSelectedProjectId(event.target.value);
        setFilterType('project');
        setSelectedLeadId(''); 
    };

    useEffect(() => {
        const fetchCompletedProjects = async () => {
            if (filterType === 'lead' && selectedLeadId) {
                try {
                    const response = await axios.get(`http://localhost:5000/completed-projects/lead/${selectedLeadId}`);
                    setCompletedProjects(response.data);
                } catch (error) {
                    console.error("Error fetching completed projects by lead:", error);
                    setCompletedProjects([]);
                }
            } else if (filterType === 'project' && selectedProjectId) {
                try {
                    const response = await axios.get(`http://localhost:5000/completed-projects/project/${selectedProjectId}`);
                    setCompletedProjects(response.data);
                } catch (error) {
                    console.error("Error fetching completed projects by project:", error);
                    setCompletedProjects([]);
                }
            } else {
                setCompletedProjects([]);
            }
        };

        fetchCompletedProjects();
    }, [selectedLeadId, selectedProjectId, filterType]);

    return (
        <div>
            <h2>Completed Projects</h2>

            <div>
                <label htmlFor="leadSelect">Filter by Lead:</label>
                <select id="leadSelect" value={selectedLeadId} onChange={handleLeadChange}>
                    <option value="">Select a Lead</option>
                    {leads.map(lead => (
                        <option key={lead._id} value={lead._id}>
                            {lead.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="projectSelect">Filter by Project:</label>
                <select id="projectSelect" value={selectedProjectId} onChange={handleProjectChange}>
                    <option value="">Select a Project</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            <h3>Completed Projects:</h3>
            {completedProjects.length > 0 ? (
                <ul>
                    {completedProjects.map(project => (
                        <li key={project._id}>{project.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No completed projects found.</p>
            )}
        </div>
    );
};

export default Complete;
