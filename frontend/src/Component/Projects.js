import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import '../css/Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTasks } from '@fortawesome/free-solid-svg-icons';

import Update from './Update';
import Task from './Task';


const Projects = () => {
   
    const [data, setdata] = useState([]);
    const [msg, setMsg] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);


    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        axios.get("http://localhost:5000/project/all")
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setdata(res.data);
                } else if (res.data && res.data.msg) {
                    setMsg(res.data.msg);
                } else {
                    setMsg("No projects found.");
                }
            })
            .catch(err => {
                console.error("Error fetching projects:", err);
                setMsg("Error fetching projects.");
            });
    };

    const moveTask = (objId, newCategory) => {
        const upd = data.map((obj) => {
            if (obj._id === objId) {
                return { ...obj, category: newCategory };
            }
            return obj;
        });
        setdata(upd);

        axios.put(`http://localhost:5000/project/${objId}`, { category: newCategory })
            .then(res => {
                console.log("Category updated successfully:", res.data);
            })
            .catch(err => {
                console.error("Error updating category:", err);
                setMsg("Error updating category.");
            });
    };

    const completeTask = (objId) => {
        axios.put(`http://localhost:5000/project/${objId}`, { status: 'completed' })
            .then(res => {
                console.log("Project completed successfully:", res.data);
                setdata(data.filter(project => project._id !== objId));
            })
            .catch(err => {
                console.error("Error completing project:", err);
                setMsg("Error completing project.");
            });
    };

    const deleteTask = (objId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            axios.delete(`http://localhost:5000/project/${objId}`)
                .then(res => {
                    console.log("Project deleted successfully:", res.data);
                    setdata(data.filter(project => project._id !== objId));
                })
                .catch(err => {
                    console.error("Error deleting project:", err);
                    setMsg("Error deleting project.");
                });
        }
    };

    const openUpdateModal = (project) => {
        setSelectedProject(project);
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedProject(null);
    };

    const openTaskModal = (project) => {
        setSelectedProject(project); // Use selectedProject to store the project for TaskModal
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        setSelectedProject(null);
    };

    const updateProject = (updatedProjectData) => {
        axios.put(`http://localhost:5000/project/${updatedProjectData._id}`, updatedProjectData)
            .then(res => {
                console.log("Project updated successfully:", res.data);
                setdata(data.map(project => project._id === updatedProjectData._id ? res.data : project));
                closeUpdateModal();
            })
            .catch(err => {
                console.error("Error updating project:", err);
                setMsg("Error updating project.");
            });
    };

    const addTaskToProject = async (projectId, newTask) => {
        try {
            const response = await axios.post(`http://localhost:5000/projects/${projectId}/tasks`, newTask);
            console.log("Task added successfully:", response.data);
            // Update the project in the local state with the new task
            setdata(prevData =>
                prevData.map(p =>
                    p._id === projectId ? { ...p, tasks: [...(p.tasks || []), response.data.task] } : p
                )
            );
            closeTaskModal();
        } catch (error) {
            console.error("Error adding task to project:", error);
            setMsg("Error adding task to project.");
        }
    };

    const renderProjects = (category) => {
        return (
            data
                .filter((obj) => obj.category === category)
                .map((obj) => (
                    <div className="task-card" key={obj._id}>
                        <p>{obj.name}</p>
                        <p>Lead: {obj.lead ? obj.lead.name : 'No Lead Selected'}</p>
                        <h5>{obj.description}</h5>
                        <div className="task-actions">
                            {category === 'To Do' && (
                                <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => moveTask(obj._id, 'In Progress')}>Move to In Progress</button>
                            )}
                            {category === 'In Progress' && (
                                <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => moveTask(obj._id, 'Code Review')}>Move to Code Review</button>
                            )}
                            {category === 'Code Review' && (
                                <button style={{ "backgroundColor": "#82ca98" }} onClick={() => moveTask(obj._id, 'Done')}>Move to Done</button>
                            )}
                            {category === 'Done' && (
                                <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => completeTask(obj._id)}>Completed</button>
                            )}
                            <br></br>
                            <button style={{ "backgroundColor": "#ffc658" }} onClick={() => openUpdateModal(obj)}>
                                <FontAwesomeIcon icon={faEdit} /> Update
                            </button>
                            <button style={{ "backgroundColor": "#f9547c" }} onClick={() => openTaskModal(obj)}>
                                <FontAwesomeIcon icon={faTasks} /> Task
                            </button>
                            <button style={{ "backgroundColor": "#8884d8" }} onClick={() => deleteTask(obj._id)}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                ))
        );
    };

    return (
        <div className="content">
            {msg && <div className="error-message">{msg}</div>}
            <div className="category-column to-do">
                <span style={{ fontWeight: 'bolder', paddingTop: '5px' }}>TO DO</span>
                {renderProjects('To Do')}
            </div>

            <div className="category-column in-progress">
                <span style={{ fontWeight: 'bolder', paddingTop: '5px' }}>IN PROGRESS</span>
                {renderProjects('In Progress')}
            </div>

            <div className="category-column code-review">
                <span style={{ fontWeight: 'bolder', paddingTop: '5px' }}>CODE REVIEW</span>
                {renderProjects('Code Review')}
            </div>

            <div className="category-column done">
                <span style={{ fontWeight: 'bolder', paddingTop: '5px' }}>DONE</span>
                {renderProjects('Done')}
            </div>

            {showUpdateModal && selectedProject && (
                <Update
                    project={selectedProject}
                    onClose={closeUpdateModal}
                    onUpdate={updateProject}
                />
            )}

            {showTaskModal && selectedProject && (
                <Task
                    project={selectedProject}
                    onClose={closeTaskModal}
                    addTask={addTaskToProject}
                />
            )}
        </div>
    );
};

export default Projects;