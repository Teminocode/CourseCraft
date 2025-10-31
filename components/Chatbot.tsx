import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import Button from './Button';
import { sendMessageToBot } from '../services/geminiService';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm your CourseCraft assistant. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newUserMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const botResponseText = await sendMessageToBot(userInput);
        const newBotMessage: Message = { sender: 'bot', text: botResponseText };
        
        setMessages(prev => [...prev, newBotMessage]);
        setIsLoading(false);
    };

    // Simple markdown to HTML renderer
    const renderText = (text: string) => {
        const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const listItems = bolded.replace(/\* (.*?)(?=\n\*|\n\n|$)/g, '<li>$1</li>');
        const lists = listItems.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        return <div dangerouslySetInnerHTML={{ __html: lists.replace(/\n/g, '<br />') }} />;
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-50 transition-transform duration-300 ${isOpen ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="!rounded-full !p-4 shadow-lg"
                    aria-label="Open chat"
                >
                    <Icon name="chat" className="w-8 h-8"/>
                </Button>
            </div>

            <div className={`fixed bottom-5 right-5 w-[calc(100%-40px)] sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex justify-between items-center p-4 bg-cyan-500 text-white rounded-t-xl">
                    <h3 className="font-bold text-lg">Creator Assistant</h3>
                    <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 p-4 h-96 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {renderText(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !userInput.trim()} className="!p-3">
                        <Icon name="send" className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </>
    );
};

export default Chatbot;