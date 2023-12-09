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
            alert('ログイン成功！');
            navigate('/');
        })
        .catch((err) => {
            setError(err.error);
            console.log(err);
            console.error('Error found.');
        });
    };

    return (
        <div className="Login">
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='ユーザID'
                    value={user_id}
                    onChange={(e) => setUser_id(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='パスワード'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type='submit'>ログイン</button>
            </form>
        </div>
    );
};

export default Login;