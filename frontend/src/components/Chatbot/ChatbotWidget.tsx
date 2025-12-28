import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ChatbotWidget.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    chunk: string;
    score: number;
    source_file?: string;
    chunk_index?: number;
  }>;
}

const ChatbotWidget: React.FC = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedStr = selection?.toString().trim() || '';

      // Only update if there's a meaningful selection (more than 3 characters)
      if (selectedStr.length > 3) {
        setSelectedText(selectedStr);
        console.log('Text selected:', selectedStr.substring(0, 50) + '...');
      }
    };

    // Listen for text selection events
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection); // For mobile

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, []);

  const handleSendMessage = async (customQuestion?: string) => {
    const questionToSend = customQuestion || input.trim();
    if (!questionToSend) return;

    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: questionToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuestion) setInput('');
    setIsTyping(true);

    try {
      // Call the backend API to get the response
      // Use API base URL from configuration passed from the Root wrapper
      const apiBaseUrl =
        typeof window !== 'undefined' && (window as any).APP_CONFIG?.API_BASE_URL
          ? (window as any).APP_CONFIG.API_BASE_URL
          : 'http://localhost:8000';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth token if user is logged in for personalized responses
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Add timeout for slow backend wake-up (Railway free tier sleeps after inactivity)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: questionToSend,
          context: selectedText || undefined, // Include selected text as context if available
          conversation_id: conversationId || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message to the conversation
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversation_id); // Update conversation ID
      
    } catch (error: any) {
      console.error('Chatbot API error:', error);
      let errorText = 'Could not get response.';

      if (error.name === 'AbortError') {
        errorText = 'Request timed out. The backend service may be waking up from sleep. Please try again in a moment.';
      } else if (error.message.includes('Failed to fetch')) {
        errorText = 'Failed to connect to the backend. The service may be starting up. Please try again in a few seconds.';
      } else {
        errorText = error.message || errorText;
      }

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${errorText}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setSelectedText(''); // Clear selected text after sending message
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    if (!selectedText) return;

    // Open chatbot if it's closed
    if (!isOpen) setIsOpen(true);

    let question = '';
    switch (action) {
      case 'explain':
        question = 'Explain this in detail';
        break;
      case 'summarize':
        question = 'Summarize this';
        break;
      case 'what':
        question = 'What is this about?';
        break;
      case 'more':
        question = 'Tell me more about this';
        break;
      default:
        question = action;
    }

    handleSendMessage(question);
  };

  return (
    <div className={clsx(styles.chatbotContainer, isOpen && styles.open)}>
      <div className={styles.chatbotHeader} onClick={() => setIsOpen(!isOpen)}>
        Book Assistant
        <span className={styles.toggleIcon}>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className={styles.chatbotBody}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <p>Hello! I'm your book assistant for "Physical AI & Humanoid Robotics".</p>
                <p>Ask me anything about the book content, or select text and ask about it specifically!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={clsx(styles.message, styles[msg.role])}>
                  <div className={styles.messageContent}>
                    {msg.content}
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <details className={styles.sources}>
                      <summary>Sources</summary>
                      <ul>
                        {msg.sources.map((source, idx) => (
                          <li key={idx} className={styles.sourceItem}>
                            <p>{source.chunk.substring(0, 200)}{source.chunk.length > 200 ? '...' : ''}</p>
                            <small>Relevance: {(source.score * 100).toFixed(1)}%</small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))
            )}
            
            {isTyping && (
              <div className={clsx(styles.message, styles.assistant)}>
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {selectedText && (
            <div className={styles.selectedTextNotice}>
              <div className={styles.selectedTextHeader}>
                <strong>📌 Selected text:</strong>
                <button
                  onClick={() => setSelectedText('')}
                  className={styles.clearButton}
                  title="Clear selected text"
                >
                  ✕
                </button>
              </div>
              <div className={styles.selectedTextContent}>
                "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
              </div>
              <div className={styles.quickActions}>
                <button
                  onClick={() => handleQuickAction('explain')}
                  className={styles.quickActionButton}
                  title="Get detailed explanation"
                >
                  📖 Explain
                </button>
                <button
                  onClick={() => handleQuickAction('summarize')}
                  className={styles.quickActionButton}
                  title="Get summary"
                >
                  📝 Summarize
                </button>
                <button
                  onClick={() => handleQuickAction('what')}
                  className={styles.quickActionButton}
                  title="Ask what this is about"
                >
                  ❓ What is this?
                </button>
              </div>
            </div>
          )}
          
          <div className={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the book content..."
              className={styles.chatInput}
              rows={2}
            />
            <button 
              onClick={handleSendMessage} 
              className={styles.sendButton}
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;