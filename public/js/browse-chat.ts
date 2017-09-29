document.addEventListener('DOMContentLoaded', () => {
  const chat = {
    messages: [],
    settings: {
      messagesCount: 50,
    },
    cacheDom() {
      this.chatBrowser = document.getElementById('chat-browser');
    },
    init(): void {
      this.cacheDom();

      this.scrollToBottom();

      this.loadMessages();
    },
    render() {
      this.cleanChatBrowser();

      this.messages.forEach((message: any) => {
        const msgContainer = document.createElement('div');
        msgContainer.classList.add('chat-message-container');

        const authorImgNode = document.createElement('img');
        authorImgNode.setAttribute('src', message.senderThumbSrc);
        authorImgNode.setAttribute('alt', 'img');
        authorImgNode.classList.add('profile-image');
        msgContainer.appendChild(authorImgNode);

        const isTextMessage = message.type === 'message' && message.body !== '';
        if (isTextMessage) {
          const msgBodyNode = document.createElement('span');
          msgBodyNode.classList.add('chat-message-body');

          const msgBodyTextNode = document.createTextNode(message.body);
          msgBodyNode.appendChild(msgBodyTextNode);

          msgContainer.appendChild(msgBodyNode);
        } else {
          const msgBodyNode = document.createElement('img');

          msgBodyNode.setAttribute('src', message.attachments[0].previewUrl);
          msgBodyNode.setAttribute('alt', 'attachment');
          msgBodyNode.classList.add('chat-message-attachment');

          msgContainer.appendChild(msgBodyNode);
        }

        const timeNode = document.createElement('span');
        timeNode.classList.add('chat-message-timestamp');

        const formattedTime = `${new Date(message.timestamp).toLocaleTimeString('bg-BG', { timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit' })}`;
        const timeTextNode = document.createTextNode(formattedTime);

        timeNode.appendChild(timeTextNode);
        msgContainer.appendChild(timeNode);

        this.chatBrowser.appendChild(msgContainer);
      });

      const lastMsg = this.messages[this.messages.length - 1];
      if (lastMsg.body === '' && lastMsg.type === 'message') {
        const lastImgNode = this.chatBrowser.childNodes[this.chatBrowser.childNodes.length - 1];
        lastImgNode.childNodes[1].addEventListener('load', () => this.scrollToBottom());
      } else {
        this.scrollToBottom();
      }
    },
    cleanChatBrowser(): void {
      while (this.chatBrowser.firstChild) {
        this.chatBrowser.removeChild(this.chatBrowser.firstChild);
      }
    },
    scrollToBottom(): void {
      const chatDiv = document.getElementById('chat-browser');
      chatDiv.scrollTop = chatDiv.scrollHeight;
    },
    setUpRequest(): void {
      this.request = new XMLHttpRequest;

      this.request.onerror = () => {
        console.error('Server error dealing with the chat');
      };
    },
    loadMessages(): void {
      this.setUpRequest();

      const unixDate = +new Date();
      const amount = this.settings.messagesCount;

      this.request.open('GET', `/api/get-messages?before=${unixDate}&amount=${amount}`);

      this.request.onload = () => {
        if (this.request.status>= 200 && this.request.status < 400) {
          this.messages = JSON.parse(this.request.responseText);
          this.messages = this.messages.reverse();

          this.render();
        } else {
          console.error('Server returned an error');
        }
      };

      this.request.send();
    }
  };

  chat.init();
});
