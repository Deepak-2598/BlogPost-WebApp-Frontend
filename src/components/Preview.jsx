import React from 'react';
import { useLocation } from 'react-router-dom';

const Preview = () => {
    const location = useLocation();
    const { title, content, image, video, imageSize, videoSize, location: userLocation } = location.state || {};

    return (
        <div className="preview-container">
            <h2>{title}</h2>
            <div className="preview-content">
                <div dangerouslySetInnerHTML={{ __html: content }} />
                {image && (
                    <img 
                        src={image} 
                        alt="Preview" 
                        style={{ width: `${imageSize.width}px`, height: `${imageSize.height}px`, objectFit: 'cover' }} 
                    />
                )}
                {video && (
                    <video 
                        src={video} 
                        controls 
                        style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }} 
                    />
                )}
            </div>
            <div className="location-info">
                <label>Location: {userLocation}</label>
            </div>
        </div>
    );
};

export default Preview;
