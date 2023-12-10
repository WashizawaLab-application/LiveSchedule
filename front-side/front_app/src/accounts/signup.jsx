import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [user_id, setUser_id] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //パスワード一致確認
        if (password !== password_confirmation) {
            setError('パスワードが一致しません．');
            console.error(error);
            return;
        }

        try {
            //バックエンドにPOSTリクエスト
            await axios.post('http://127.0.0.1:8000/accounts/signup/', {
                user_id: user_id,
                username: username,
                password: password,
                password_confirmation: password_confirmation,
            });
            alert('アカウントが作成されました．');
            navigate('/login');
        } catch (err) {
            setError(err.message);
            console.log(err.message);
            console.error(error);
        }
    };

    const RenderingLogin = (e) => {
        e.preventDefault();

        navigate('/login');
    }

    return (
        <div>
            <div className='text-5xl font-sans font-bold mt-20 mb-16'>Resister</div>
            <form onSubmit={handleSubmit} className='Form'>
                <div className='m-8'>
                    <input
                        type='text'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='User ID'
                        value={user_id}
                        onChange={(e) => setUser_id(e.target.value)}
                    />
                </div>
                <div className='m-8'>
                    <input
                        type='text'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='User Name'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='m-8'>
                    <input
                        type='password'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='m-8'>
                    <input
                        type='password'
                        className='input input-bordered input-primary w-full max-w-xs'
                        placeholder='Password Again'
                        value={password_confirmation}
                        onChange={(e) => setPassword_confirmation(e.target.value)}
                    />
                </div>
                <div className='m-8'>
                    <button type='submit' className='text-xl btn btn-wide btn-outline btn-primary'>Sign Up</button>
                </div>
                <div className='m-8'>
                    <button onClick={RenderingLogin} type='submit' className='text-xl btn btn-wide btn-outline'>Log In</button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;