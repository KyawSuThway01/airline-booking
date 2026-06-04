'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m your DairyFlat Air assistant ✈ Ask me anything about our flights, routes, or prices!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage() {
        if (!input.trim() || loading) return;
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
        }
        setLoading(false);
    }

    return (
        <>
            {/* Chat window */}
            {open && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">

                    {/* Header */}
                    <div className="bg-sky-600 px-5 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">✈</div>
                            <div>
                                <p className="text-white font-bold text-sm">DairyFlat Air Assistant</p>
                                <p className="text-sky-200 text-xs">Ask me about flights</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)}
                            className="text-white/70 hover:text-white transition text-xl">✕</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-xs mr-2 shrink-0 mt-1">✈</div>
                                )}
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-sky-500 text-white rounded-tr-sm'
                                        : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-xs mr-2 shrink-0">✈</div>
                                <div className="bg-gray-800 text-gray-400 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm">
                                    <span className="animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick suggestions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            {['Flights to Sydney?', 'Cheapest route?', 'Next available flight?'].map(q => (
                                <button key={q} onClick={() => { setInput(q); }}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-white/10 transition">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/10 flex gap-2 shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask about flights..."
                            className="flex-1 bg-gray-800 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 transition placeholder-gray-600"
                        />
                        <button onClick={sendMessage} disabled={loading || !input.trim()}
                            className="bg-sky-500 hover:bg-sky-400 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2.5 rounded-xl transition font-bold text-sm">
                            ↑
                        </button>
                    </div>
                </div>
            )}

            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 z-50">
                {open ? '✕' : '✈'}
            </button>
        </>
    );
}