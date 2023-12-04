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

    return (
        <div className="Register">
            <h1>アカウント新規登録画面</h1>
            <form onSubmit={handleSubmit} className='Form'>
                <input
                    type='text'
                    placeholder='ユーザID'
                    value={user_id}
                    onChange={(e) => setUser_id(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='ユーザ名'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='パスワード'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='確認パスワード'
                    value={password_confirmation}
                    onChange={(e) => setPassword_confirmation(e.target.value)}
                />
                <button type='submit'>登録</button>
            </form>
        </div>
    );
};

export default SignUp;