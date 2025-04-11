import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../css/Filter.css";


const Filter = () => {
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [completedProjects, setCompletedProjects] = useState([]);
    const [filterType, setFilterType] = useState('project'); 
    const [projectDetails, setProjectDetails] = useState(null); 
    const [issues, setIssues] = useState([]); 

    useEffect(() => {

        const fetchLeads = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user?roles=Lead'); 
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
        setProjectDetails(null);  
        setCompletedProjects([]);   
    };

    const handleProjectChange = (event) => {
        setSelectedProjectId(event.target.value);
        setFilterType('project');
        setSelectedLeadId(''); 
        setProjectDetails(null);  
        setCompletedProjects([]);   
    };

    useEffect(() => {
        const fetchCompletedProjects = async () => {
            if (filterType === 'lead' && selectedLeadId) {
                try {
                    const response = await axios.get('http://localhost:5000/completed-project/lead/${selectedLeadId}'); 
                    setCompletedProjects(response.data);
                } catch (error) {
                    console.error("Error fetching completed projects by lead:", error);
                    setCompletedProjects([]);
                }
            } else if (filterType === 'project' && selectedProjectId) {
                try {
                    const response = await axios.get('http://localhost:5000/completed-project/project/${selectedProjectId}'); 
                    setCompletedProjects(response.data);
                } catch (error) {
                    console.error("Error fetching completed projects by project:", error);
                    setCompletedProjects([]);
                }
            } else {
                setCompletedProjects([]);
            }
        };

        const fetchProjectDetails = async () => {
            if (filterType === 'project' && selectedProjectId) {
                try {
                    const response = await axios.get('http://localhost:5000/project/details/${selectedProjectId}');
                    setProjectDetails(response.data);
                } catch (error) {
                    console.error("Error fetching project details:", error);
                    setProjectDetails(null);
                }
            } else {
                setProjectDetails(null);
            }
        };

        fetchCompletedProjects();
        if (completedProjects.length === 0) {
            fetchProjectDetails();
        }

    }, [selectedLeadId, selectedProjectId, filterType, completedProjects.length]);

    return (
        <div className="filter-container">
            <div className="header-container">
                <h2 className="header-title">Resolved recently</h2>
            </div>

            <div className="filters">
                <label htmlFor="leadSelect">Filter by Lead:</label>
                <select id="leadSelect" value={selectedLeadId} onChange={handleLeadChange} className="filter-select">
                    <option value="">Select a Lead</option>
                    {leads.map(lead => (
                        <option key={lead._id} value={lead._id}>
                            {lead.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filters">
                <label htmlFor="projectSelect">Filter by Project:</label>
                <select id="projectSelect" value={selectedProjectId} onChange={handleProjectChange} className="filter-select">
                    <option value="">Select a Project</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>...
            <h3 style={{"text-align": "center","margin-top": "40px","font-size": "20px"}}>Completed Projects</h3>
            {completedProjects.length > 0 ? (
                <ul>
                    {completedProjects.map(project => (
                        <li key={project._id}>
                            {project.name} - Lead: {project.lead ? `${project.lead.name} (${project.lead.role})` : 'No Lead'}
                            - Start Date: {new Date(project.startDate).toLocaleDateString()}
                            - End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not Set'}
                        </li>
                    ))}
                </ul>) : (
                <>
                    {projectDetails ? (
                        <table className="project-details-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Key</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Lead</th>
                                    <th>Members</th>
                                    <th>Starting Date</th>
                                    <th>Ending Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{projectDetails.name}</td>
                                    <td>{projectDetails.key}</td>
                                    <td>{projectDetails.description}</td>
                                    <td>{projectDetails.category}</td>
                                    <td>{projectDetails.status}</td>
                                    <td>{projectDetails.lead ? `${projectDetails.lead.name} (${projectDetails.lead.role})` : 'No Lead'}</td>
                                    <td>
                                        {projectDetails.members && projectDetails.members.length > 0 ? (
                                            <ul>
                                                {projectDetails.members.map(member => (
                                                    <li key={member._id}>
                                                        {member.name} ({member.role})
                                                    </li>
                                                ))}
                                            </ul>) : ('No Members')}
                                    </td>
                                    <td>{projectDetails.startDate ? new Date(projectDetails.startDate).toLocaleDateString() : 'Not Set'}</td>
                                    <td>{projectDetails.endDate ? new Date(projectDetails.endDate).toLocaleDateString() : 'Not Set'}</td>

                                </tr>
                            </tbody>
                        </table>) : (
                        <p style={{"text-align": "center","margin-top": "-5px"}}>Please select your project and search...</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Filter;