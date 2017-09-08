document.addEventListener('DOMContentLoaded', () => {
  const chat = {
    init(): void {
      this.scrollToBottom();
    },
    scrollToBottom(): void {
      const chatDiv = document.getElementById('chat-browser');
      chatDiv.scrollTop = chatDiv.scrollHeight;
    },
  };

  chat.init();
});
