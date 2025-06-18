import React from 'react';
import MyProfileInfo from '../components/MyProfileInfo';
import FormSection from '../components/FormSection';
import TemplateSection from '../components/TemplateSection';
import { useTranslation } from 'react-i18next';

const templates = [{id: 1, title: 'Test Template', tags: ['#test_tag_1', '#test_tag_2']}]
const forms = [{id: 1, title: 'Test Form', filledAt: '01.02.2025'}]

function MyProfilePage () {
    const {t, i18n} = useTranslation();

    return (
    <div className="container-fluid mt-5">
        <div className="row justify-content-center">
        <div className="col-md-8">
            <MyProfileInfo />
            <hr className="my-4" />
            <TemplateSection title={t('myProfile.myTemplates')} templates={templates}/>
            <hr className="my-4" />
            <FormSection title={t('myProfile.myForms')} forms={forms}/>
        </div>
        </div>
    </div>
    )
};

export default MyProfilePage;