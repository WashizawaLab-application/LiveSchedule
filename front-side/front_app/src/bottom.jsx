import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BottomNavi = () => {
    const navigate = useNavigate();

    const RenderingHome = (e) => {
        e.preventDefault();

        navigate('/');
    };

    const RenderingList = (e) => {
        e.preventDefault();

        navigate('/list');
    };

    const RenderingUser = (e) => {
        e.preventDefault();

        navigate('/user');
    };

    return (
        <div className="btm-nav">
            <button className="text-primary" onClick={RenderingHome}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </button>
            <button className="text-primary active" onClick={RenderingList}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
            </button>
            <button className="text-primary" onClick={RenderingUser}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" stroke="none" d="M0 0h24v24H0z"/>  <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" cx="12" cy="7" r="4" />  <path strokeWidth="2" d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
            </button>
        </div>
    )
}

export default BottomNavi;