import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Delete = () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        setError(null);

        try {
            await axios.post('http://127.0.0.1:8000/accounts/delete/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }});
            alert('アカウントが正常に削除されました．');
            navigate('/signup');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError('アカウントの削除に失敗しました．' || err.response.data.message);
            } else {
                setError('アカウントの削除中に問題が発生しました．');
            }
            console.error(error);
        }
    };

    return (
        <div>
            <h1>アカウント削除</h1>
            <p>ユーザーID: {user_id}</p>
            <p>アカウントを削除しますか？</p>
            <button onClick={handleDelete}>アカウントを削除</button>
            {error && <p className='error'>{error}</p>}
        </div>
    );
};

export default Delete;