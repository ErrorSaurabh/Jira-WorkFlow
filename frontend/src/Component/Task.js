import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

const Task = ({ project, onClose, addTask }) => {
    const [taskName, setTaskName] = useState('frontend');
    const [taskStatus, setTaskStatus] = useState('To Do');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch users who are either a developer or a lead
                const usersResponse = await axios.get(`http://localhost:5000/user?roles=Developer`);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTask = {
            name: taskName,
            status: taskStatus,
            assignedTo,
            startDate,
            endDate,
        };

        addTask(project._id, newTask);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Task to Project</h2>

                <form onSubmit={handleSubmit}>
                    <label>Task Name:</label>
                    <select value={taskName} onChange={e => setTaskName(e.target.value)}>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="testing">Testing</option>
                    </select>

                    <label>Task Status:</label>
                    <select value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Code Review">Code Review</option>
                        <option value="Done">Done</option>
                    </select>

                    <label>Assigned To:</label>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>

                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} />

                    <label>End Date:</label>
                    <DatePicker selected={endDate} onChange={date => setEndDate(date)} />

                    <button type="submit">Add Task</button>
                </form>
            </div>
        </div>
    );
};

export default Task;
