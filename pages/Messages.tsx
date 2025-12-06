
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { MOCK_USERS, MOCK_CONVERSATIONS, MOCK_ANNOUNCEMENTS, DataService } from '../services/dataService';
import { Message, Conversation, Announcement } from '../types';
import { Search, Bell, Mail, Send, CheckCheck, Tag, AlertCircle, User as UserIcon } from 'lucide-react';

const Messages = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'chats' | 'announcements'>('chats');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Helper to get user details
  const getUser = (id: string) => MOCK_USERS.find(u => u.id === id);

  const activeConversation = selectedConversationId ? MOCK_CONVERSATIONS.find(c => c.id === selectedConversationId) : null;

  useEffect(() => {
    if (selectedConversationId) {
      setMessages(DataService.getMessages(selectedConversationId));
    }
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputMessage,
      timestamp: new Date(),
      read: false
    };

    DataService.addMessage(selectedConversationId, newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex">
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200">
           <div className="flex bg-slate-200 p-1 rounded-lg mb-4">
              <button 
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'chats' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveTab('announcements')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'announcements' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Notices
              </button>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {activeTab === 'chats' ? (
             <div className="divide-y divide-slate-100">
                {MOCK_CONVERSATIONS.map(conv => {
                   const participant = getUser(conv.participantId);
                   return (
                     <div 
                       key={conv.id}
                       onClick={() => setSelectedConversationId(conv.id)}
                       className={`p-4 hover:bg-white cursor-pointer transition-colors ${selectedConversationId === conv.id ? 'bg-white border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                     >
                        <div className="flex justify-between items-start mb-1">
                           <div className="flex items-center gap-2">
                              {participant?.avatar ? (
                                <img src={participant.avatar} className="w-8 h-8 rounded-full" alt="" />
                              ) : (
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center"><UserIcon size={14} /></div>
                              )}
                              <span className="font-semibold text-sm text-slate-800">{participant?.name}</span>
                           </div>
                           <span className="text-[10px] text-slate-400">{conv.timestamp.toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate pl-10">{conv.lastMessage}</p>
                     </div>
                   );
                })}
             </div>
           ) : (
             <div className="divide-y divide-slate-100">
                {MOCK_ANNOUNCEMENTS.map(ann => (
                  <div key={ann.id} className="p-4 hover:bg-white cursor-pointer transition-colors group">
                     <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ann.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                           {ann.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">{ann.date.toLocaleDateString()}</span>
                     </div>
                     <h4 className="font-semibold text-sm text-slate-800 mb-1 group-hover:text-indigo-600">{ann.title}</h4>
                     <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeTab === 'chats' ? (
           selectedConversationId && activeConversation ? (
             <>
               {/* Chat Header */}
               <div className="h-16 border-b border-slate-100 flex items-center px-6 justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src={getUser(activeConversation.participantId)?.avatar} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800">{getUser(activeConversation.participantId)?.name}</h3>
                        <p className="text-xs text-slate-500">{getUser(activeConversation.participantId)?.role}</p>
                     </div>
                  </div>
               </div>
               
               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                           isMe 
                             ? 'bg-indigo-600 text-white rounded-br-none' 
                             : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                         }`}>
                            <p>{msg.text}</p>
                            <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && <CheckCheck size={12} />}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>

               {/* Input Area */}
               <div className="p-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                     <input 
                       type="text" 
                       className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1 text-slate-800 placeholder:text-slate-400"
                       placeholder="Type a message..."
                       value={inputMessage}
                       onChange={(e) => setInputMessage(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                     />
                     <button 
                       onClick={handleSendMessage}
                       disabled={!inputMessage.trim()}
                       className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                     >
                        <Send size={18} />
                     </button>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <Mail size={32} />
                </div>
                <p>Select a conversation to start chatting.</p>
             </div>
           )
        ) : (
          <div className="p-8 max-w-2xl mx-auto w-full overflow-y-auto">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">School Announcements</h2>
             <div className="space-y-6">
                {MOCK_ANNOUNCEMENTS.map(ann => (
                  <div key={ann.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     {ann.priority === 'HIGH' && <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full -mr-10 -mt-10"></div>}
                     <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                           ann.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-blue-600'
                        }`}>
                           {ann.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                           <Bell size={12} /> {ann.date.toLocaleDateString()}
                        </span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{ann.title}</h3>
                     <p className="text-slate-600 leading-relaxed mb-4">{ann.content}</p>
                     <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-slate-200 rounded-full overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=${ann.author}&background=random`} alt="" />
                           </div>
                           <span className="text-xs font-medium text-slate-500">Posted by {ann.author}</span>
                        </div>
                        <div className="flex gap-2">
                           {ann.tags.map(tag => (
                              <span key={tag} className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                                 <Tag size={10} /> {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
