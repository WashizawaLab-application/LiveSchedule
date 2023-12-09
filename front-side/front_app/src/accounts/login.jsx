import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/accounts/login/', {
            user_id: user_id,
            password: password,
        })
        .then((res) => {
            localStorage.setItem('user_id', res.data.user_id);
            localStorage.setItem('token', res.data.token);
            console.log(res.data.user_id, res.data.token);
            navigate('/');
        })
        .catch((err) => {
            setError(err.error);
            console.log(err);
            console.error('Error found.');
        });
    };

    const RenderingSignup = (e) => {
        e.preventDefault();

        navigate('/signup');
    }

    return (
        <div>
            <div className='text-5xl font-sans font-bold mt-20 mb-16'>Welcome</div>
            <form onSubmit={handleSubmit}>
                <div className='m-8'>
                    <input
                        type='text'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='User ID'
                        value={user_id}
                        onChange={(e) => setUser_id(e.target.value)}
                        required
                    />
                </div>
                <div className='m-8'>
                    <input
                        type='password'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className='m-8'>
                    <button type='submit' className='text-xl btn btn-wide btn-outline btn-primary'>Log In</button>
                </div>
            </form>
            <div className="flex flex-col w-full">
                <div className="mx-8 divider divider-primary text-xl">OR</div>
            </div>
            <div className='m-8'>
                <button onClick={RenderingSignup} className='text-xl btn btn-wide btn-outline btn-primary'>Sign Up</button>
            </div>
        </div>
    );
};

export default Login;