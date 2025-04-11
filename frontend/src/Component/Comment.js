import React, { useState } from 'react';
import '../css/Comment.css'; 

const Comment = ({ isOpen, onClose, onSubmit }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = () => {
        if (commentText.trim()) {
            onSubmit(commentText);
            setCommentText(''); 
            onClose(); 
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Comment on Project</h2>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment here..."
                />
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Submit Comment</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Comment;

