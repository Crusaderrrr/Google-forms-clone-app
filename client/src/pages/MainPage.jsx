import React, { useState, useEffect } from 'react'
import TemplateSection from '../components/TemplateSection';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function MainPage () {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);

    const isMain = location.pathname === '/main';

    useEffect(()=> {
        const fetchTemplates = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/templates/latest', { withCredentials: true })

                if (response.status === 200) {
                    setTemplates(response.data.templates)
                    setLoading(false);
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [])

    return (
    <>
        <div className='container-fluid mt-5'>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className='display-5'>{t('main.latest')}</h4>
                    <TemplateSection templates={templates} isMain={isMain} loading={loading}/>
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