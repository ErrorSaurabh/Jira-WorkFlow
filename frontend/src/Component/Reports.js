import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../css/Report.css'; 
import Ct from '../Component/Ct'; 

const Reports = () => {
    const { userData } = useContext(Ct); 
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        if (userData && userData._id) {
            fetchProjects();
        }
    }, [userData]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/project/all');
            const allProjects = response.data;

            
            const developerProjects = allProjects.filter(project =>
                project.members.some(member => member._id === userData._id)
            );

            setProjects(developerProjects);
            setFilteredProjects(developerProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleDateFilter = () => {
        let filtered = [...projects];

        if (fromDate) {
            const fromDateObj = new Date(fromDate).setHours(0, 0, 0, 0);
            filtered = filtered.filter(project => {
                const createdAtDate = new Date(project.createdAt).setHours(0, 0, 0, 0);
                return createdAtDate >= fromDateObj;
            });
        }

        if (toDate) {
            const toDateObj = new Date(toDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(project => {
                const createdAtDate = new Date(project.createdAt).setHours(0, 0, 0, 0);
                return createdAtDate <= toDateObj;
            });
        }

        setFilteredProjects(filtered);
    };

    const generatePdf = () => {
        const doc = new jsPDF();
        const columns = ["Name", "Lead", "Members", "Category", "Status", "Created At", "Updated At"];
        
        const rows = filteredProjects.map(project => [
            project.name,
            project.lead ? project.lead.name : 'No Lead',
            project.members.map(member => member.name).join(', '),
            project.category,
            project.status,
            new Date(project.createdAt).toLocaleDateString(),
            new Date(project.updatedAt).toLocaleDateString(),
        ]);

        doc.autoTable({
            head: [columns],
            body: rows,
        });

        doc.save('developer_project_report.pdf');
    };

    return (
        <div className="report-container">
            <h2>Developer Project Report</h2>

       
            <div className="date-filters">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                <button onClick={handleDateFilter}>Filter by Date</button>
            </div>

          
            <button onClick={generatePdf}>Download PDF</button>

       
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Lead</th>
                        <th>Members</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map(project => (
                        <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.lead ? project.lead.name : 'No Lead'}</td>
                            <td>{project.members.map(member => member.name).join(', ')}</td>
                            <td>{project.category}</td>
                            <td>{project.status}</td>
                            <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
