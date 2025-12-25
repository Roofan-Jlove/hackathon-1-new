// Chatbot loader script that adds the chatbot only on docs pages
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a docs page (not homepage) - also include other possible book content routes
  const path = window.location.pathname;

  // Show only on documentation pages (modules, weeks, topics)
  if (path.startsWith('/docs/')) {
    // Create a container for the chatbot
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'book-chatbot-container';
    document.body.appendChild(chatbotContainer);

    // Add some basic styles to ensure it doesn't interfere with content
    const style = document.createElement('style');
    style.textContent = `
      #book-chatbot-container {
        position: relative !important;
        z-index: 10000 !important;
      }
    `;
    document.head.appendChild(style);

    // Initialize chatbot in the container
    // Since we can't directly run React here, we'll create a basic implementation
    initializeChatbotWidget(chatbotContainer);
  }
});

function initializeChatbotWidget(container) {
  // Create the chatbot UI elements directly with vanilla JavaScript
  const chatbotHtml = `
    <div id="chatbot-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: sans-serif;">
      <div id="chatbot-header" style="background: #1c6bb0; color: white; padding: 10px 15px; cursor: pointer; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <span>Book Assistant</span>
        <span id="chatbot-toggle">+</span>
      </div>
      <div id="chatbot-body" style="display: none; background: white; border: 1px solid #ddd; border-radius: 0 0 8px 8px; width: 350px; height: 500px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); flex-direction: column;">
        <div id="chatbot-messages" style="flex: 1; padding: 15px; overflow-y: auto; height: calc(100% - 100px);"></div>
        <div id="chatbot-input-area" style="padding: 10px; border-top: 1px solid #eee; display: flex;">
          <textarea id="chatbot-input" placeholder="Ask about the book content..." style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: none; height: 50px;"></textarea>
          <button id="chatbot-send" style="margin-left: 10px; padding: 10px 15px; background: #1c6bb0; color: white; border: none; border-radius: 4px; cursor: pointer;">Send</button>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = chatbotHtml;
  
  // Add functionality
  const header = document.getElementById('chatbot-header');
  const body = document.getElementById('chatbot-body');
  const toggle = document.getElementById('chatbot-toggle');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  
  // Toggle chatbot open/close
  let isOpen = false;
  header.addEventListener('click', function() {
    if (isOpen) {
      body.style.display = 'none';
      toggle.textContent = '+';
    } else {
      body.style.display = 'flex';
      body.style.flexDirection = 'column';
      toggle.textContent = '−';
    }
    isOpen = !isOpen;
  });
  
  // Send message function
  function sendMessage() {
    const text = input.value.trim();
    if (text) {
      // Add user message
      addMessage(text, 'user');
      input.value = '';
      
      // Get selected text if any
      const selectedText = window.getSelection().toString().trim();
      
      // Simulate bot response (in real implementation, this would call your API)
      setTimeout(() => {
        let response = "I'm your book assistant. I can help you understand the content. ";
        
        if (selectedText) {
          response += "I see you've selected text. What would you like to know about it?";
        } else {
          response += "Please ask specific questions about the book content.";
        }
        
        addMessage(response, 'bot');
      }, 1000);
    }
  }
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.padding = '8px 12px';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.maxWidth = '80%';
    
    if (sender === 'user') {
      messageDiv.style.background = '#1c6bb0';
      messageDiv.style.color = 'white';
      messageDiv.style.marginLeft = 'auto';
      messageDiv.style.textAlign = 'right';
    } else {
      messageDiv.style.background = '#f1f1f1';
      messageDiv.style.color = 'black';
      messageDiv.style.marginRight = 'auto';
    }
    
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}