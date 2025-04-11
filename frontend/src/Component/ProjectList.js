import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Ct from '../Component/Ct';
import Comment from './Comment';


const ProjectList = () => {
    const [data, setdata] = useState([]);
    const [msg, setMsg] = useState("");
    const { userData } = useContext(Ct);
    const [completionRequested, setCompletionRequested] = useState({});
    
    // State for managing comments
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);

        
    useEffect(() => {
        fetchProjects();
    }, [userData]);

    const fetchProjects = () => {
        if (!userData || !userData._id) {
            setMsg("User data is not available.");
            return;
        }

        axios.get("http://localhost:5000/project/all")
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    const filteredProjects = res.data.filter(project => {
                        const isMember = project.members.some(member => member._id === userData._id);
                        const isLead = project.lead && project.lead._id === userData._id;
                        return isMember || isLead;
                    });
                    setdata(filteredProjects);
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
                fetchProjects();
            });
    };

    const requestCompletion = (objId) => {
        console.log(`Completion requested for project ${objId}`);
        alert("Request sent to lead for completion.");
        setCompletionRequested(prevState => ({ ...prevState, [objId]: true }));
    };


    const openCommentModal = (projectId) => {
        setCurrentProjectId(projectId);
        setIsModalOpen(true);
    };


    const handleCommentSubmit = (commentText) => {
        axios.put(`http://localhost:5000/project/${currentProjectId}`, { 
            comment: commentText,
            user: userData._id 
        })
        .then(res => {
            console.log("Comment added successfully:", res.data);
            fetchProjects(); 
        })
        .catch(err => {
            console.error("Error adding comment:", err);
            setMsg("Error adding comment.");
        });
    };

    const renderProjects = (category) => {
        return (
            data
                .filter((obj) => obj.category === category)
                .map((obj) => (
                    <div className="task-card" key={obj._id}>
                        <p>{obj.name}</p>
                        <p>Key: {obj.key}</p>
                        <p>Lead: {obj.lead ? obj.lead.name : 'No Lead Selected'}</p>
                        <p>Members: {obj.members.length > 0 ? obj.members.map(member => member.name).join(', ') : 'No Members'}</p>
                        <h5>{obj.description}</h5>
                        <div className="task-actions">
                            {completionRequested[obj._id] ? (
                                <p>Completion Requested</p>
                            ) : (
                                <>
                                    {category === 'To Do' && (
                                        <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => moveTask(obj._id, 'In Progress')}>Move to In Progress</button>
                                    )}
                                    {category === 'In Progress' && (
                                        <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => moveTask(obj._id, 'Code Review')}>Move to Code Review</button>
                                    )}
                                    {category === 'Code Review' && (
                                        <button style={{ "backgroundColor": "#82ca9d" }} onClick={() => moveTask(obj._id, 'Done')}>Move to Done</button>
                                    )}
                                    {category === 'Done' && (
                                        <button style={{ "backgroundColor": "#ffc658" }} onClick={() => requestCompletion(obj._id)}>Request Completion</button>
                                    )}
                                    <br></br>
                                    <button style={{ "backgroundColor": "#8884d8" }} onClick={() => openCommentModal(obj._id)}>
                                        <FontAwesomeIcon icon={faComment} /> Comment
                                    </button>
                                </>
                            )}
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

       
            <Comment 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleCommentSubmit} 
            />
        </div>
    );
};

export default ProjectList;

