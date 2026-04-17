import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, Paperclip, Mic, MoreVertical } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, text: "Hey! How are you doing today?", sender: "other", timestamp: "10:00 AM", reactions: {} },
  { id: 2, text: "I'm doing great, thanks for asking! Have you seen the new component design?", sender: "me", timestamp: "10:02 AM", reactions: { '👍': 1, '❤️': 1 } },
];

const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const WhatsAppChatDemo = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    // Tracks which message is currently showing the reaction picker
    const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 1. Close emoji picker when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        // Use mousedown to execute immediately on click outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 2. Handle sending a new message
    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue.trim(),
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: {}
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");
        setShowEmojiPicker(false);
    };

    // Append selected emoji to input field
    const handleEmojiClick = (emojiData) => {
        setInputValue((prev) => prev + emojiData.emoji);
    };

    // 3. Handle adding a reaction to a specific message
    const handleReaction = (messageId, emoji) => {
        setMessages((prev) => prev.map(msg => {
            if (msg.id === messageId) {
                const currentCount = msg.reactions[emoji] || 0;
                return {
                    ...msg,
                    reactions: {
                        ...msg.reactions,
                        [emoji]: currentCount + 1
                    }
                };
            }
            return msg;
        }));
        setActiveReactionMessageId(null);
    };

    return (
        <div className="flex flex-col h-[650px] w-full max-w-lg mx-auto relative bg-[#efeae2] border shadow-2xl overflow-hidden sm:rounded-2xl font-sans">
            
            {/* --- Chat Header --- */}
            <div className="bg-[#00a884] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="avatar" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[16px] leading-tight tracking-wide">Sarah</h2>
                        <span className="text-xs text-green-100 font-medium">online</span>
                    </div>
                </div>
                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                    <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
                </button>
            </div>

            {/* --- Chat Messages Area --- */}
            {/* WhatsApp Standard Background Pattern Simulation */}
            <div 
                className="flex-1 overflow-y-auto p-4 space-y-6" 
                style={{ 
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat' 
                }}
            >
                {messages.map((msg) => (
                    <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        handleReaction={handleReaction}
                        activeReactionMessageId={activeReactionMessageId}
                        setActiveReactionMessageId={setActiveReactionMessageId}
                    />
                ))}
                {/* Invisible element to auto-scroll to the bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* --- Input Area --- */}
            <div className="bg-[#f0f2f5] px-3 py-3 relative shrink-0">
                
                {/* Real-time Emoji Picker Component */}
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-full left-2 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            autoFocusSearch={false}
                            theme="light"
                            height={350}
                            width="100%"
                            previewConfig={{ showPreview: false }}
                        />
                    </div>
                )}

                {/* Input Form Fields */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2.5 transition-colors rounded-full ${showEmojiPicker ? 'text-[#00a884] bg-white shadow-sm' : 'text-[#54656f] hover:bg-gray-200'}`}
                        title="Open Emoji Picker"
                    >
                        <Smile className="w-6 h-6" />
                    </button>
                    
                    <button 
                        type="button" 
                        className="p-2 text-[#54656f] hover:bg-gray-200 rounded-full transition-colors hidden sm:block"
                        title="Attach file"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-white border-none rounded-xl px-4 py-[11px] focus:outline-none shadow-sm text-gray-800 placeholder-[#8696a0]"
                        style={{ fontSize: '15px' }}
                    />

                    {inputValue.trim() ? (
                        <button 
                            type="submit" 
                            className="p-3.5 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition-colors shadow-sm cursor-pointer ml-1 animate-in zoom-in duration-200"
                        >
                            <Send className="w-[18px] h-[18px] ml-0.5" />
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            className="p-3.5 text-[#54656f] hover:bg-gray-200 rounded-full transition-colors ml-1"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};


/* ====================================================
   Sub-Component: MessageBubble
   Handles message rendering, time, formatting, and rendering reactions.
==================================================== */
const MessageBubble = ({ message, handleReaction, activeReactionMessageId, setActiveReactionMessageId }) => {
    const isMe = message.sender === "me";
    const hasReactions = Object.keys(message.reactions).length > 0;
    
    // Sum the total amount of specific reactions added
    let totalReactions = 0;
    Object.values(message.reactions).forEach(count => totalReactions += count);

    return (
        <div 
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}
            // Clear active reaction menu when mouse leaves the bubble row
            onMouseLeave={() => setActiveReactionMessageId(null)}
        >
            <div 
                className={`relative max-w-[80%] sm:max-w-[70%] px-[11px] pt-[7px] pb-5 shadow-sm text-gray-800 ${
                    isMe 
                      ? 'bg-[#d9fdd3] rounded-lg rounded-tr-none' 
                      : 'bg-white rounded-lg rounded-tl-none'
                }`}
                // Mobile Support: Simulate long press action with Context Menu; Desktop Support: regular hover
                onMouseEnter={() => !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && setActiveReactionMessageId(message.id)}
                onContextMenu={(e) => { 
                    e.preventDefault(); 
                    setActiveReactionMessageId(message.id); 
                }}
            >
                {/* Overlay React Bar Picker Menu */}
                {activeReactionMessageId === message.id && (
                    <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-3 py-2 flex items-center justify-center gap-1 z-20 border border-gray-100 animate-in zoom-in duration-150">
                        {AVAILABLE_REACTIONS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleReaction(message.id, emoji)}
                                className="hover:scale-125 focus:scale-125 hover:-translate-y-1 transition-all cursor-pointer text-xl sm:text-2xl outline-none"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Bubble Text Content */}
                <p className="text-[14.5px] leading-snug break-words">
                    {message.text}
                </p>
                
                {/* Bubble Time Stamp and Read Receipt */}
                <span className="text-[11px] text-[#667781] absolute right-2 bottom-1 float-right flex items-center select-none">
                    {message.timestamp}
                    {isMe && <span className="ml-[3px] text-[#53bdeb] text-[13px] font-bold">✓✓</span>}
                </span>

                {/* Bubble Attached Reactions */}
                {hasReactions && (
                    <div 
                        className={`absolute -bottom-3.5 ${isMe ? 'right-2' : 'left-2'} bg-white border border-gray-100 shadow-sm rounded-full px-1.5 py-[2px] flex items-center cursor-pointer select-none z-10`}
                    >
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                            <span key={emoji} className="text-[13px] mr-1 last:mr-0 drop-shadow-sm">
                                {emoji}
                            </span>
                        ))}
                        {totalReactions > 1 && (
                            <span className="font-semibold text-[#54656f] text-[10px] ml-1 tracking-tighter">
                                {totalReactions}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsAppChatDemo;
