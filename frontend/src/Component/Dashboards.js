import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, ZAxis, Scatter, ComposedChart, Legend, Area, Line } from "recharts";
import axios from 'axios';
import '../css/Dashboard.css';
import { format, parseISO, isValid } from 'date-fns';


const Dashboards = () => {
    const [projects, setProjects] = useState([]);
    const [leadData, setLeadData] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [projectTimelineData, setProjectTimelineData] = useState([]);
    const [projectStatusData, setProjectStatusData] = useState([]);
  


    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:5000/project/all");
            const projects = response.data;

            const categoryCounts = {
                "To Do": 0,
                "In Progress": 0,
                "Code Review": 0,
                "Done": 0,
            };

            projects.forEach(project => {
                if (categoryCounts.hasOwnProperty(project.category)) {
                    categoryCounts[project.category]++;
                }
            });

            const projectStatusData = Object.keys(categoryCounts).map(category => ({
                name: category,
                value: categoryCounts[category]
            }));

            setProjectStatusData(projectStatusData);

            const leadCounts = {};
            projects.forEach(project => {
                const leadName = project.lead ? project.lead.name : "Unassigned";
                leadCounts[leadName] = (leadCounts[leadName] || 0) + 1;
            });

            const leadAssignmentData = Object.keys(leadCounts).map(category => ({
                name: category,
                value: leadCounts[category]
            }));

            setLeadData(leadAssignmentData);

            // Modified member data calculation to count unique members
            const memberSet = new Set();
            projects.forEach(project => {
                if (project.members) {
                    project.members.forEach(member => {
                        if (member && member.name) {
                            memberSet.add(member.name); // Add member name to the Set
                        }
                    });
                }
            });

            const memberAssignmentData = Array.from(memberSet).map(memberName => ({
                name: memberName,
                value: 1 // Assign a value of 1 to each unique member
            }));

            setMemberData(memberAssignmentData);

            const timelineData = projects.flatMap(project => {
                const timelinePoints = [];
                if (project.todoDate) {
                    const parsedDate = parseISO(project.todoDate);
                    if (isValid(parsedDate)) {
                        timelinePoints.push({
                            name: project.name,
                            category: "To Do",
                            date: parsedDate,
                            y: 1,
                        });
                    }
                }
                if (project.inProgressDate) {
                    const parsedDate = parseISO(project.inProgressDate);
                    if (isValid(parsedDate)) {
                        timelinePoints.push({
                            name: project.name,
                            category: "In Progress",
                            date: parsedDate,
                            y: 2,
                        });
                    }
                }
                if (project.codeReviewDate) {
                    const parsedDate = parseISO(project.codeReviewDate);
                    if (isValid(parsedDate)) {
                        timelinePoints.push({
                            name: project.name,
                            category: "Code Review",
                            date: parsedDate,
                            y: 3,
                        });
                    }
                }
                if (project.doneDate) {
                    const parsedDate = parseISO(project.doneDate);
                    if (isValid(parsedDate)) {
                        timelinePoints.push({
                            name: project.name,
                            category: "Done",
                            date: parsedDate,
                            y: 4,
                        });
                    }
                }
                return timelinePoints;
            });

            setProjectTimelineData(timelineData);

        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const CustomTooltip = ({ active, payload, label, chartName }) => {
        if (active && payload && payload.length) {
            let tooltipLabel = '';
            let tooltipDesc = '';

            switch (chartName) {
                case 'ProjectStatus':
                    tooltipLabel = `Category: ${payload[0].payload.name}`;
                    tooltipDesc = `Projects: ${payload[0].value}`;
                    break;
                case 'LeadStatus':
                    tooltipLabel = `Lead: ${payload[0].payload.name}`;
                    tooltipDesc = `Projects: ${payload[0].value}`;
                    break;
                case 'MemberStatus':
                    tooltipLabel = `Member: ${payload[0].payload.name}`;
                    tooltipDesc = `Projects: ${payload[0].value}`;
                    break;
                case 'ProjectTimeline':
                    const data = payload[0].payload; // Access the data object correctly
                    tooltipLabel = `Project: ${data.name}`;
                    tooltipDesc = `Category: ${data.category}, Date: ${data.date ? format(data.date, 'yyyy-MM-dd') : 'N/A'}`;
                    break;
                default:
                    tooltipLabel = `Label: ${label}`;
                    tooltipDesc = `Value: ${payload[0].value}`;
                    break;
            }

            return (
                <div className="custom-tooltip">
                    <p className="label">{tooltipLabel}</p>
                    <p className="desc">{tooltipDesc}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="dash">
            <div className="board1">
                <h2 className='head2'>Project Status</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={projectStatusData}>
                        <CartesianGrid stroke="#DCDCDC" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 'dataMax + 4']} />
                        <Tooltip content={<CustomTooltip chartName="ProjectStatus" />} />
                        <Legend />
                        <Bar dataKey="value" barSize={100} fill="rgba(237, 19, 237, 0.2)" />
                        <Line type="monotone" dataKey="value" stroke="darkviolet" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="board2">
                <h1 style={{ "marginTop": "-30px" }}>Lead Status</h1>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={leadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip chartName="LeadStatus" />} />
                        <Legend />
                        <Area type="monotone" dataKey="value" fill="#8884d8" />
                        <Bar dataKey="value" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="value" stroke="#ff7300" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="board3">
                <h1 style={{ "marginTop": "-10px" }}>Member Status</h1>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={memberData}>
                        <CartesianGrid stroke="#DCDCDC" /> {/* light grey grid */}
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 'dataMax + 5']} />
                        <Tooltip content={<CustomTooltip chartName="MemberStatus" />} />
                        {/* Add the text on top. */}
                        <Bar dataKey="value" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="board4">
                <h1 style={{ "marginTop": "-10px" }}>Project Timeline</h1>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#DCDCDC" />
                        <XAxis
                            dataKey="date"
                            name="Date"
                            type="category"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(date) => (date && isValid(date)) ? format(date, 'yyyy-MM-dd') : ''}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            dataKey="y"
                            name="Category"
                            type="number"
                            domain={[0.5, 4.5]}
                            ticks={[1, 2, 3, 4]}
                            tickFormatter={(y) => {
                                switch (y) {
                                    case 1: return 'To Do';
                                    case 2: return 'In Progress';
                                    case 3: return 'Code Review';
                                    case 4: return 'Done';
                                    default: return '';
                                }
                            }}
                        />
                        <ZAxis dataKey="name" name="Project" />
                        <Tooltip content={<CustomTooltip chartName="ProjectTimeline" />} />
                        <Scatter data={projectTimelineData} fill='blue' />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboards;