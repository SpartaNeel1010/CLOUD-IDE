import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';
import { useNavigate, useSearchParams } from 'react-router-dom';


const formatMessage = (content) => {
    // First convert literal \n to actual newlines
    
    let formatted = content.replace(/\\n/g, '\n');
    
    // Store code blocks temporarily
    const codeBlocks = [];
    formatted = formatted.replace(/```([\s\S]*?)```/g, (_match, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      // Also handle \n in code blocks
      codeBlocks.push(code.trim().replace(/\\n/g, '\n'));
      return placeholder;
    });
  
    // Store inline code temporarily
    const inlineCode = [];
    formatted = formatted.replace(/`([^`]+)`/g, (_match, code) => {
      const placeholder = `__INLINE_CODE_${inlineCode.length}__`;
      // Also handle \n in inline code
      inlineCode.push(code.replace(/\\n/g, '\n'));
      return placeholder;
    });
  
    // Handle newlines for regular text
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\//, '');
  
    // Restore inline code
    inlineCode.forEach((code, i) => {
      formatted = formatted.replace(
        `__INLINE_CODE_${i}__`,
        `<code>${code}</code>`
      );
    });
  
    // Restore code blocks with preserved newlines
    codeBlocks.forEach((code, i) => {
      formatted = formatted.replace(
        `__CODE_BLOCK_${i}__`,
        `<pre><code>${code}</code></pre>`
      );
    });
  
    return formatted;
  };

const MessageContent = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />;
};

const ChatWidget = ({code}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const [searchparams]=useSearchParams()
  const projID=searchparams.get("projID")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
      

      const response = await fetch(`http://${projID}.vedant-neel-aarav.site/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: "IF code is to be generated generate it in seperate box\n"+code+"\n"+inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setInputMessage('');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, there was an error processing your message.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      <button 
        className="chat-widget-button"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
        aria-label="Open chat"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="chat-widget-window">
          <div className="chat-widget-header">
            <div className="chat-widget-title">
              <svg 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>AI Assistant</span>
            </div>
            <button 
              className="chat-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-widget-content">
            <div className="chat-messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <MessageContent content={message.content} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="chat-input"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="chat-submit-button"
                aria-label="Send message"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="18" 
                  height="18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;