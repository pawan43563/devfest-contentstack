document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatArea = document.querySelector('.chat-area');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('input', toggleSendButton);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function toggleSendButton() {
        sendButton.disabled = userInput.value.trim() === '';
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat('user', message);

        // Clear input
        userInput.value = '';
        toggleSendButton();

        // Send message to API and get response
        sendMessageToAPI(message);
    }

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

        if (sender === 'bot') {
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('bot-avatar');
            messageDiv.appendChild(avatarDiv);
        }

        const messageP = document.createElement('p');
        messageP.textContent = message;
        messageDiv.appendChild(messageP);

        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    async function sendMessageToAPI(message) {
        try {
            // Show loading message
            addMessageToChat('bot', 'Thinking...');

            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Sample API response
            const response = await fetch('https://api.example.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            // Remove loading message
            chatArea.removeChild(chatArea.lastChild);

            // Add bot response to chat
            addMessageToChat('bot', data.response);
        } catch (error) {
            console.error('Error:', error);
            chatArea.removeChild(chatArea.lastChild);
            addMessageToChat('bot', 'Sorry, I encountered an error. Please try again later.');
        }
    }
});

