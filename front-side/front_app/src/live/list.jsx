import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import BottomNavi from '../bottom';

export const ViewList = () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const data = []
    const navigate = useNavigate();

    const fetchVideos = () => {
        try {
            axios.post('http://127.0.0.1:8000/live/show/', {
                user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})
            .then((res) => {
                console.log(res.data.items);
                setItems(res.data.items);
                console.log(items);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    navigate('/login');
                };
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || '動画を登録できませんでした．';
                setError(errorMsg);
            } else {
                setError('An unexpected error occurred.');
            }
            console.error(error);
        };
    };

    useEffect(() => {
        if (user_id) fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GoToPage = (video_id) => {
        window.open(`https://www.youtube.com/watch?v=${video_id}`);
    }

    if (items) {
        for (let i = 0; i < items.length; i++) {
            data.push(
                <div className="m-4 card w-96 bg-base-100 shadow-xl" key={items[i].items.video_id}>
                    <figure><img src={items[i].items.thumbnail} alt="Shoes" /></figure>
                    <div className="card-body">
                        <div className="card-title">{items[i].items.title}</div>
                        <div className="card-actions justify-center">
                            <button onClick={() => GoToPage(items[i].items.video_id)} className="btn btn-primary">Video Page</button>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className='w-full'>
            <div className='text-2xl font-sans font-bold m-8 text-center'>Broadcast Schedule</div>
            <div className='mb-8'>
                {data[0] ? (
                    <div className='m-4 flex flex-wrap'>
                        {data}
                    </div>
                ) : (
                    <div>
                        <div className='text-xl font-sans font-bold m-8'>There are no videos scheduled for broadcast.</div>
                    </div>
                )}
            </div>
            <BottomNavi />
        </div>
    )
};

export default ViewList;