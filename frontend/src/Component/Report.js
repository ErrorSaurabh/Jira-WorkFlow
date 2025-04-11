import React, { useState, useEffect } from 'react';

import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../css/Report.css';


const Report = () => {
 
    const [projects, setProjects] = useState([]); 
    const [filteredProjects, setFilteredProjects] = useState([]); 
    const [selectedProjectId, setSelectedProjectId] = useState(''); 
    const [selectedLeadId, setSelectedLeadId] = useState(''); 
    const [selectedMemberId, setSelectedMemberId] = useState(''); 
    const [leads, setLeads] = useState([]); 
    const [members, setMembers] = useState([]);
    const [fromDate, setFromDate] = useState(''); 
    const [toDate, setToDate] = useState(''); 
    

    useEffect(() => {
        fetchProjects(); 
        fetchLeads();
        fetchMembers(); 
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/project/all');
            setProjects(response.data);
            setFilteredProjects(response.data); 
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchLeads = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user?roles=Manager'); 
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user?roles=Developer'); 
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleProjectChange = (e) => {
        setSelectedProjectId(e.target.value);
        filterProjects(e.target.value); 
    };

    const handleLeadChange = (e) => {
        setSelectedLeadId(e.target.value);
        filterByLead(e.target.value); 
    };

    const handleMemberChange = (e) => {
        setSelectedMemberId(e.target.value);
        filterByMember(e.target.value); 
    };

    const handleDateFilter = () => {
        let filtered = projects;

        if (fromDate) {
            const fromDateObj = new Date(fromDate);
            filtered = filtered.filter(project => {
                const createdAtDate = new Date(project.createdAt);
                return createdAtDate >= fromDateObj;
            });
        }

        if (toDate) {
            const toDateObj = new Date(toDate);
            filtered = filtered.filter(project => {
                const createdAtDate = new Date(project.createdAt);
                return createdAtDate <= toDateObj;
            });
        }

        setFilteredProjects(filtered);
    };

    

    const filterProjects = (projectId) => {
        if (projectId) {
            const filtered = projects.filter(project => project._id === projectId);
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects(projects); 
        }
    };

    const filterByLead = (leadId) => {
        if (leadId) {
            const filtered = projects.filter(project => project.lead && project.lead._id === leadId);
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects(projects); 
        }
    };

    const filterByMember = (memberId) => {
        if (memberId) {
            const filtered = projects.filter(project => project.members && project.members.some(member => member._id === memberId));
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects(projects);
        }
    };
    const generatePdf = () => {
        const doc = new jsPDF();

       
        const columns = [
            "Name", "Lead", "Members", "Category",
            "Status", "Created At", "Updated At", "In Progress Date",
            "Code Review Date", "Done Date"
        ];

       
        const rows = filteredProjects.map(project => [
            project.name,
            project.lead ? project.lead.name : 'No Lead',
            project.members && project.members.length > 0 ? project.members.map(member => member.name).join(', ') : 'No Members',
            project.category,
            project.status,
            new Date(project.createdAt).toLocaleDateString(),
            new Date(project.updatedAt).toLocaleDateString(),
            project.inProgressDate ? new Date(project.inProgressDate).toLocaleDateString() : 'N/A',
            project.codeReviewDate ? new Date(project.codeReviewDate).toLocaleDateString() : 'N/A',
            project.doneDate ? new Date(project.doneDate).toLocaleDateString() : 'N/A',
            project.pendingDate ? new Date(project.pendingDate).toLocaleDateString() : 'N/A',
            project.tasks && project.tasks.length > 0 ? project.tasks.map(task => `${task.name} (${task.status})`).join(', ') : 'No Tasks',
            project.comments && project.comments.length > 0 ? project.comments.map(comment => new Date(comment.text).toLocaleDateString()).join(', ') : 'No Comments'
        ]);

        
        doc.autoTable({
            head: [columns],
            body: rows,
        });

     
        doc.save('project_report.pdf');
    };

    return (
        <div className="report-container">
        <h2>PROJECT REPORT</h2>

      
        <div className="filter-container">
          
            <div>
                <label htmlFor="projectSelect">Filter By Project:</label>
                <select id="projectSelect" value={selectedProjectId} onChange={handleProjectChange}>
                    <option value="">All Projects</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

          
            <div>
                <label htmlFor="leadSelect">Filter By Manager:</label>
                <select id="leadSelect" value={selectedLeadId} onChange={handleLeadChange}>
                    <option value="">All Managers</option>
                    {leads.map(lead => (
                        <option key={lead._id} value={lead._id}>
                            {lead.name}
                        </option>
                    ))}
                </select>
            </div>

          
            <div>
                <label htmlFor="memberSelect">Filter By Member:</label>
                <select id="memberSelect" value={selectedMemberId} onChange={handleMemberChange}>
                    <option value="">All Members</option>
                    {members.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>

          
            <div className="date-filters">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
                <button onClick={handleDateFilter}>Filter</button>
            </div>

            <button onClick={generatePdf}>Get Project PDF</button>
        </div>

        <table className="projects-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Description</th>
                <th>Lead</th>
                <th>Members</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>In Progress Date</th>
                <th>Code Review Date</th>
                <th>Done Date</th>
                <th>Pending Date</th>
                <th>Tasks</th>
                <th>Comments</th>
            </tr>
        </thead>
        <tbody>
            {filteredProjects.map(project => (
                <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{project.key}</td>
                    <td>{project.description}</td>
                    <td>{project.lead ? project.lead.name : 'No Lead'}</td>
                    <td>{project.members && project.members.length > 0 ?
                        project.members.map(member => member.name).join(', ') : 'No Members'}</td>
                    <td>{project.category}</td>
                    <td>{project.status}</td>
                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                    <td>{project.inProgressDate ? new Date(project.inProgressDate).toLocaleDateString() : '--'}</td>
                    <td>{project.codeReviewDate ? new Date(project.codeReviewDate).toLocaleDateString() : '--'}</td>
                    <td>{project.doneDate ? new Date(project.doneDate).toLocaleDateString() : '--'}</td>
                    <td>{project.pendingDate ? new Date(project.pendingDate).toLocaleDateString() : '--'}</td>
                    <td>
                        {project.tasks && project.tasks.length > 0 ? (
                            project.tasks.map(task => (
                                <div key={task._id}>
                                    {task.name} ({task.status})
                                </div>
                            ))
                        ) : (
                            '--'
                        )}
                    </td>
                    <td>
                        {project.comments && project.comments.length > 0 ? (
                            project.comments.map(comment => (
                                <div key={comment._id}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                            ))
                        ) : (
                            '--'
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

    );
};

export default Report;