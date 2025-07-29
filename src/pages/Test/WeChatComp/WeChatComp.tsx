
import styles from './WeChatComp.less';
import React, { useState, useEffect, useRef } from 'react';
interface Props {
    userId: string;
}
const ChatComp: React.FC<Props> = ({ userId }) => {
    const [toUserId, setToUserId] = useState('');
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:666/adminChat?userId=${userId}`);

        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        return () => {
            ws.current?.close();
        };
    }, [userId]);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ to: toUserId, msg }));
            setMessages((prev) => [...prev, `你对 ${toUserId} 说：${msg}`]);
            setMsg('');
        }
    };

    return (
        <div>
            <h3>我是 {userId}</h3>
            <input
                placeholder="对方 ID"
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
            />
            <br />
            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />
            <br />
            <button onClick={sendMessage} type='submit'>发送</button>
            <div>
                <h4>消息记录</h4>
                {messages.map((m, i) => (
                    <div key={i}>{m}</div>
                ))}
            </div>
        </div>
    );
};

export default ChatComp;



