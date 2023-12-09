import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useNavigate} from 'react-router-dom';

export const Index = () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const [q, setQ] = useState('');
    const [channel_title, setChannel_title] = useState('');
    const [channel_id, setChannel_id] = useState('');
    const [channel_thumbnail, setChannel_thumbnail] = useState('');
    const [description, setDescription] = useState('');
    const [searchError, setSearchError] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    // const [listError, setListError] = useState(null);
    const [registerMsg, setRegisterMsg] = useState('');
    // const [listMsg, setListMsg] = useState('');
    // const navigate = useNavigate();

    const searchSubmit = async (e) => {
        e.preventDefault();

        await axios.post('http://127.0.0.1:8000/live/search/', {
            q: q,
        }, {headers: {
            'X-AUTH-TOKEN': token,
        }})
        .then((res) => {
            console.log(res.data.data);
            setChannel_title(res.data.data.title);
            setChannel_id(res.data.data.id);
            setChannel_thumbnail(res.data.data.thumbnail);
            setDescription(res.data.data.description);
        })
        .catch((err) => {
            console.error(err.error);
            setSearchError('検索に失敗しました');
        })
    };

    const registerSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://127.0.0.1:8000/live/register/', {
            user_id: user_id,
            channel_title: channel_title,
            channel_id: channel_id,
            channel_thumbnail: channel_thumbnail,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }})

            setRegisterMsg('登録しました');
        } catch (err) {
            setQ('');
            console.error(err.error);
            setRegisterError('登録できませんでした');
        }
    };

    const fetchList = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/live/list/', {
            user_id: user_id,
            }, {headers: {
                'X-AUTH-TOKEN': token,
            }});
            console.log(response.data.items);
        } catch (err) {
            // setListError(err.data.message);
            // setListMsg('チャンネルを登録しましょう！');
        }
    };

    useEffect(() => {
        if (user_id) fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerMsg]);


    return (
        <div>
            <input
                type='text'
                value={q}
                onChange={(e) => setQ(e.target.value)}
                required
            />
            {searchError && <p className='error'>{searchError}</p>}
            <button onClick={searchSubmit}>検索</button>
            {channel_title ? (
                <>
                    <img src={channel_thumbnail} alt=''/>
                    <p>チャンネル名: {channel_title}</p>
                    <p>説明: {description}</p>
                    <button onClick={registerSubmit}>登録</button>
                    {registerError && <p>{registerError}</p>}
                </>
            ) : (
                <></>
            )}
        </div>
    )

};

export default Index;