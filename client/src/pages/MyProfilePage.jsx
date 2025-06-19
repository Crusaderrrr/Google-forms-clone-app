import React, { useEffect, useState } from 'react';
import MyProfileInfo from '../components/MyProfileInfo';
import FormSection from '../components/FormSection';
import TemplateSection from '../components/TemplateSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import test_img from '../assets/background_image.webp'

const templates = [{id: 1, title: 'Test Template 1', tags: ['#test_tag_1', '#test_tag_2'], image: test_img}, 
    {id: 2, title: 'Test Template 2', tags: ['#test_tag_1', '#test_tag_2'], image: test_img}, 
    {id: 3, title: 'Test Template 3', tags: ['#test_tag_1', '#test_tag_2'], image: test_img}]
const forms = [{id: 1, title: 'Test Form', filledAt: '01.02.2025', image: test_img}]

function MyProfilePage () {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('templates');

    useEffect(() => {
        if (localStorage.getItem('role') === 'guest') {
            navigate('/login')
        }
    }, [])

    const handleTplSet = () => {
        setActiveSection('templates')
    }

    const handleFormsSet = () => {
        setActiveSection('forms')
    }

    return (
    <div className="container-fluid mt-5">
        <div className="row justify-content-center">
        <div className="col-md-8">
            <MyProfileInfo />
            <div className="text-center">
                <div className="btn-group w-100" role="group" aria-label="Basic example">
                    <button 
                        type="button" 
                        className={`btn ${activeSection === 'templates' ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-100`}
                        onClick={handleTplSet}
                        >
                        Templates
                    </button>
                    <button 
                        type="button" 
                        className={`btn ${activeSection === 'forms' ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-100`}
                        onClick={handleFormsSet}
                        >
                        Forms
                    </button>
                </div>
            </div>
            <hr className="my-4" />
            <div>
                {activeSection === 'templates' && (
                    <TemplateSection title="Templates" templates={templates} />
                )}
                {activeSection === 'forms' && (
                    <FormSection title="Forms" forms={forms} />
                )}
            </div>
        </div>
        </div>
    </div>
    )
};

export default MyProfilePage;