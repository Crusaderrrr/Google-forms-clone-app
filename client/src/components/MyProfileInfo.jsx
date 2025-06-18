import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext'

function MyProfileInfo () {
    const {email, name, profileImg} = useApp();

    useEffect(() => {
    
    }, [])

return (
    <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex align-items-center">
        <img
            src={profileImg}
            alt="Profile"
            className="rounded-circle me-4"
            width="80"
            height="80"
        />
        <div>
            <h5 className="card-title mb-1">{name}</h5>
            <p className="card-text text-muted mb-0">{email}</p>
        </div>
        </div>
    </div>
    )
};

export default MyProfileInfo;