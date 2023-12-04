import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const UserUpdate = () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/user-detail/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }});
            setUser(response.data.user);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || 'ユーザ情報の取得に失敗しました．';
                setError(errorMsg);
            } else {
                setError('An unexpected error occurred.');
            }
            console.error(error);
        }
    };

    useEffect(() => {
        if (user_id) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id]);

    const handleUpdate = async () => {
        setError(null);

        try {
            await axios.patch('http://127.0.0.1:8000/accounts/user-update/', {
                user_id: user_id,
                username: username,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }});
            alert('ユーザ情報が更新されました．');
            window.location.reload();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || '更新中にエラーが発生しました．');
            } else {
                setError('予期しないエラーが発生しました．');
            }
            console.error(error);
        }
    };

    return (
        <div>
            {user ? (
                <>
                    <p>ユーザID: {user.user_id}</p>
                    <p>ユーザ名: {user.username}</p>
                </>
            ) : (
                <p>ユーザ情報を読み込んでいます...</p>
            )}

            <input
                type='text'
                placeholder='ユーザー名'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            {error && <p className='error'>{error}</p>}
            <button onClick={handleUpdate}>更新</button>
        </div>
    );
};

export default UserUpdate;