// Replace this with your actual n8n webhook URL
const WEBHOOK_URL = 'https://superbee.app.n8n.cloud/webhook/ed45083d-6651-4c66-b351-21df8916ac7a/chat';

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// FAQ Toggle
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    
    // Close all FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('open');
    });
    
    // Open clicked FAQ if it was closed
    if (!isOpen) {
        answer.classList.add('open');
    }
}

// Size Button Selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Quantity Controls
const qtyDisplay = document.querySelector('.qty-display');
const qtyBtns = document.querySelectorAll('.qty-btn');

if (qtyDisplay && qtyBtns) {
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let currentQty = parseInt(qtyDisplay.textContent);
            if (this.textContent === '+') {
                currentQty++;
            } else if (this.textContent === '-' && currentQty > 1) {
                currentQty--;
            }
            qtyDisplay.textContent = currentQty;
        });
    });
}

// Add to Cart Animation
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Add to Cart')) {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = '✓ Added!';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        });
    }
});

// Wishlist Toggle
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.textContent = this.textContent === '♡' ? '♥' : '♡';
        this.style.color = this.textContent === '♥' ? 'var(--honey-gold)' : '';
    });
});

// Chat Widget Functionality
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatMinimize = document.getElementById('chatMinimize');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat window
function toggleChat() {
    chatButton.classList.toggle('active');
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
}

if (chatButton) {
    chatButton.addEventListener('click', toggleChat);
}

if (chatMinimize) {
    chatMinimize.addEventListener('click', toggleChat);
}

// Parse markdown to HTML
function parseMarkdown(text) {
    if (!text) return '';
    
    // Replace bold **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Replace italic *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Replace line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Replace bullet points
    text = text.replace(/^- (.*$)/gim, '• $1');
    text = text.replace(/^\* (.*$)/gim, '• $1');
    
    // Replace numbered lists
    text = text.replace(/^\d+\. (.*$)/gim, '<div style="margin-left: 10px;">$&</div>');
    
    // Replace inline code `code`
    text = text.replace(/`([^`]+)`/g, '<code style="background: var(--soft-beige); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>');
    
    // Replace links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--honey-gold); text-decoration: underline;">$1</a>');
    
    return text;
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = sender === 'user' ? 'message-bubble user-bubble' : 'message-bubble bot-bubble';
    
    // Parse markdown for bot messages, plain text for user messages
    if (sender === 'bot') {
        bubbleDiv.innerHTML = parseMarkdown(text);
    } else {
        bubbleDiv.textContent = text;
    }
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send message to n8n webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatInput: message,
                sessionId: getSessionId()
            })
        });

        const data = await response.json();
        
        // Remove typing indicator
        typingIndicator.remove();

        // Add bot response
        // Adjust this based on your webhook's response structure
        const botMessage = data.output || data.response || data.message || 'Sorry, I could not process that request.';
        addMessage(botMessage, 'bot');

    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        addMessage('Sorry, I\'m having trouble connecting. Please try again or email us at support@honeydropapparel.com', 'bot');
    }
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="message-bubble bot-bubble typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Generate or retrieve session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
}

// Send message on button click
if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
}

// Send message on Enter key
if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}