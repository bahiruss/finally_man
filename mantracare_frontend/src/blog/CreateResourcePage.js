import React, { useState } from 'react';
import './CreateResource.css';

const CreateResource = ({ accessToken }) => {
    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceContent, setResourceContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3500/resources', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceTitle,
                    resourceContent,
                }),
            });

            if (response.ok) {
                setMessage('Resource created successfully!');
                setResourceTitle('');
                setResourceContent('');
            } else {
                setMessage('Failed to create resource');
            }
        } catch (error) {
            setMessage('Failed to create resource');
        }
    };

    return (
        <div className="create-resource-wrapper">
            <form className="create-resource-form" onSubmit={handleSubmit}>
                <h2 className="create-resource-header">Create a Resource</h2>
                <div className="create-resource-input-group">
                    <label htmlFor="title" className="create-resource-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        required
                        className="create-resource-input"
                    />
                </div>
                <div className="create-resource-input-group">
                    <label htmlFor="content" className="create-resource-label">Content</label>
                    <textarea
                        id="content"
                        value={resourceContent}
                        onChange={(e) => setResourceContent(e.target.value)}
                        required
                        className="create-resource-textarea"
                    ></textarea>
                </div>
                <button type="submit" className="create-resource-button">Create Resource</button>
                {message && <p className="create-resource-message">{message}</p>}
            </form>
        </div>
    );
};

export default CreateResource;
