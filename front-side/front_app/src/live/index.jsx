import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import BottomNavi from '../bottom';

export const Index = () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const [items, setItems] = useState([]);
    const [q, setQ] = useState('');
    const [channel_title, setChannel_title] = useState('');
    const [channel_id, setChannel_id] = useState('');
    const [channel_thumbnail, setChannel_thumbnail] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const data = [];
    const search_result = [];
    const navigate = useNavigate();

    const fetchList = () => {
        try {
            axios.post('http://127.0.0.1:8000/live/list/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then((res) => {
                setItems(res.data.items);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    navigate('/login');
                };
            });
        } catch {
            setError('An unexpected error occured.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const SearchSubmit = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/live/search/', {
            q: q,
        }, {headers: {
            'X-AUTH-TOKEN': token,
        }})
        .then((res) => {
            setChannel_title(res.data.data.title);
            setChannel_id(res.data.data.id);
            setChannel_thumbnail(res.data.data.thumbnail);
            setDescription(res.data.data.description);
            setQ('');
            console.log(res.data.data);
        })
        .catch(() => {
            setError('Search failed.');
            console.error(error);
        });
    };

    const RegisterSubmit = (e) => {
        e.preventDefault();

        const register_data = {
            user_id: user_id,
            channel_title: channel_title,
            channel_id: channel_id,
            channel_thumbnail: channel_thumbnail,
        }
        try {
            axios.post('http://127.0.0.1:8000/live/register/', register_data, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then(() => {
                console.log(register_data);
                window.location.reload();
            })
            .catch(() => {
                setError('Could not register.');
                console.error(error);
            })
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || '配信者情報を登録できませんでした．';
                setError(errorMsg);
            } else {
                setError('An unexpected error occurred.');
            }
            console.error(error);
        };
    };

    const ChannelDelete = (delete_id) => {
        try {
            axios.post('http://127.0.0.1:8000/live/delete/', {
                user_id: user_id,
                channel_id: delete_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then((res) => {
                window.location.reload();
            });
        } catch {
            setError('An unexpected error ocurred.');
            console.error(error);
        };
    };

    //動画取得ページへ
    const RenderingList = (e) => {
        e.preventDefault();

        navigate('/list');
    }

    // 表データ
    if (items) {
        for (let i = 0; i < items.length; i++) {
            data.push(
                <tbody key={items[i].channel_id}>
                    <tr>
                        <th className="flex items-center gap-3 justify-center">
                            <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                    <img src={items[i].channel_thumbnail} alt="Avatar Tailwind CSS Component" />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-xl">{items[i].channel_title}</div>
                            </div>
                            <div>
                                <button onClick={() => ChannelDelete(items[i].channel_id)}><svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg></button>
                            </div>
                        </th>
                    </tr>
                </tbody>
            );
        };
    };

    // 検索結果
    if (channel_id) {
        search_result.push(
            <tbody key={channel_id}>
                <tr>
                    <th className="flex items-center gap-3 justify-center">
                        <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                                <img src={channel_thumbnail} alt="Avatar Tailwind CSS Component" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-xl">{channel_title}</div>
                        </div>
                        <div>
                            <div className="">{description}</div>
                        </div>
                    </th>
                </tr>
            </tbody>
        )
    }

    return (
        <div>
            {/* Search部分 */}
            <div className='m-8'>
                <form onSubmit={SearchSubmit}>
                    <input
                        type='text'
                        className='m-4 input input-bordered input-primary w-full max-w-xs'
                        placeholder="Type Channel's Name"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        required
                    />
                    <button type='submit' className='m-4 text-xl btn btn-outline btn-primary'>Search</button>
                </form>
            </div>
            {search_result[0] ? (
                <div>
                    <div className='overflow-x-auto'>
                        <table className="table">
                            {search_result}
                        </table>
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <div>
                        <button onClick={RegisterSubmit} className='m-4 text-xl btn btn-outline btn-primary'>Register</button>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className="flex flex-col w-full">
                <div className="mx-8 divider divider-primary text-xl font-bold">Registered Lists</div>
            </div>

            {/* チャンネル登録部分 */}
            {data[0] ? (
                <div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {data}
                        </table>
                    </div>
                    <div>
                        <button className='m-4 text-xl btn bth-wide btn-outline btn-primary' onClick={RenderingList}>Video Acquisition</button>
                    </div>
                </div>
            ) : (
                <div>Subscribe to the channel!</div>
            )}

            <BottomNavi />
        </div>
    )
};

export default Index;