import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import BottomNavi from '../bottom';

export const UserUpdate = () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = () => {
        try {
            axios.post('http://127.0.0.1:8000/accounts/user-detail/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then((res) => {
                setUser(res.data.user);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    navigate('/login');
                };
            });
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
            // alert('Update User Info.');
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

    const handleDelete = (e) => {
        e.preventDefault();
        setError(null);

        try {
            axios.post('http://127.0.0.1:8000/accounts/delete/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then(() => {
                navigate('/signup');
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError('アカウントの削除に失敗しました．' || err.response.data.message);
            } else {
                setError('アカウントの削除中に問題が発生しました．');
            }
            console.error(error);
        };
    };

    const RenderingLogin = (e) => {
        e.preventDefault();

        navigate('/login');
    };

    // const DeleteAccount = (e) => {
    //     e.preventDefault();
    // };

    return (
        <>
            <div className='m-20'>
                {user ? (
                    <>
                        <div className="m-4 font-bold text-2xl">User ID</div>
                        <div className='m-4 text-xl'>{user.user_id}</div>
                        <div className="m-4 font-bold text-2xl">User Name</div>
                        <div className='m-4 text-xl'>{user.username}</div>
                        <div className='m-4'>
                            <input
                                type='text'
                                className='input input-bordered input-primary w-full max-w-xs'
                                placeholder='New User Name'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className='font-bold text-xl'>{error}</p>}
                        <div className='m-4'>
                            <button className='btn btn-outline btn-primary' onClick={handleUpdate}>Update</button>
                        </div>
                        <div className='m-4'>
                            <button className='btn btn-outline btn-primary' onClick={RenderingLogin}>Change Account</button>
                        </div>
                        <div className='m-4'>
                            <button className='btn btn-outline btn-error' onClick={()=>document.getElementById('my_modal_1').showModal()}>Delete Account</button>
                            <dialog id="my_modal_1" className="modal">
                            <div className="modal-box">
                                <div className="m-4 font-bold text-lg">Do you really want to delete your account?</div>
                                <button onClick={handleDelete} className='m-2 btn btn-outline btn-error'>Delete</button>
                                <div className="modal-action">
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                                </div>
                            </div>
                            </dialog>
                        </div>
                    </>
                ) : (
                    <div className="font-bold text-xl">User information is being read.</div>
                )}
            </div>

            <BottomNavi />
        </>
    );
};

export default UserUpdate;