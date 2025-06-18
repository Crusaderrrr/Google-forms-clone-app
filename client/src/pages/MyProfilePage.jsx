import React from 'react';
import MyProfileInfo from '../components/MyProfileInfo';
import MyTemplates from '../components/MyTemplates';
import MyForms from '../components/MyForms';

function MyProfilePage () {
    return (
    <div className="container mt-5 pt-4">
        <div className="row justify-content-center">
        <div className="col-md-8">
            <MyProfileInfo />
            <hr className="my-4" />
            <MyTemplates />
            <hr className="my-4" />
            <MyForms />
        </div>
        </div>
    </div>
    )
};

export default MyProfilePage;