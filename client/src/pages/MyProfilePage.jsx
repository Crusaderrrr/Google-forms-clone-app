import React from 'react';
import MyProfileInfo from '../components/MyProfileInfo';
import MyTemplates from '../components/MyTemplates';
import MyForms from '../components/MyForms';
import FormSection from '../components/FormSection';
import TemplateSection from '../components/TemplateSection';

const templates = [{id: 1, title: 'Test Template', tags: ['#test_tag']}]
const forms = [{id: 1, title: 'Test Form', filledAt: '01.02.2025'}]

function MyProfilePage () {
    return (
    <div className="container-fluid mt-5">
        <div className="row justify-content-center">
        <div className="col-md-8">
            <MyProfileInfo />
            <hr className="my-4" />
            <TemplateSection title={'My Templates'} templates={templates}/>
            <hr className="my-4" />
            <FormSection title={'My Forms'} forms={forms}/>
        </div>
        </div>
    </div>
    )
};

export default MyProfilePage;