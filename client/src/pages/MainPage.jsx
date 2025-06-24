import React, { useEffect } from 'react'
import TemplateSection from '../components/TemplateSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const templates = [{id: 1, title: 'Main Page Test Template', tags: [{ templateId: 11, tagId: 10, tag: { id: 8, name: "Tag1" } }, { templateId: 10, tagId: 9, tag: { id: 9, name: "Tag2" } }]}]

function MainPage () {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    return (
    <>
        <div className='container-fluid mt-5'>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <TemplateSection title={t('main.latest')} templates={templates}/>
                     <hr className='my-4'/>
                     <h4>Tags Cloud</h4>
                     <hr className='my-4'/>
                </div>
            </div>
        </div>
    </>
    )
};

export default MainPage;