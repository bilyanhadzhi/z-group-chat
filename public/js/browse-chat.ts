document.addEventListener('DOMContentLoaded', () => {
  const chat = {
    messages: [],
    settings: {
      messagesPerLoad: 50,
    },
    cacheDom() {
      this.chatBrowser = document.getElementById('chat-browser');

      this.buttons = {
        first: document.getElementById('first-button'),
        prev: document.getElementById('prev-button'),
        next: document.getElementById('next-button'),
        last: document.getElementById('last-button'),
      };
    },
    init(): void {
      this.cacheDom();
      this.bindEvents();

      this.scrollToBottom();

      this.loadMessages(undefined, undefined, undefined);
    },
    bindEvents(): void {
      this.buttons.first.addEventListener('click', this.loadFirstPage.bind(this));
      this.buttons.prev.addEventListener('click', this.loadPrevPage.bind(this));
      this.buttons.next.addEventListener('click', this.loadNextPage.bind(this));
      this.buttons.last.addEventListener('click', this.loadLastPage.bind(this));
    },
    render(): void {
      this.cleanChatBrowser();

      this.messages.forEach((message: any) => {
        const msgContainer = document.createElement('div');
        msgContainer.classList.add('chat-message-container');

        const authorImgNode = document.createElement('img');
        authorImgNode.setAttribute('src', message.senderThumbSrc);
        authorImgNode.setAttribute('alt', 'img');
        authorImgNode.classList.add('profile-image');
        msgContainer.appendChild(authorImgNode);

        const isTextMessage = message.type === 'message';
        const isEvent = message.type === 'event';
        const isEmpty = message.body === '';

        if (isTextMessage && !isEmpty) {
          const msgBodyNode = document.createElement('span');
          msgBodyNode.classList.add('chat-message-body');

          const msgBodyTextNode = document.createTextNode(message.body);
          msgBodyNode.appendChild(msgBodyTextNode);

          msgContainer.appendChild(msgBodyNode);
        } else if (isTextMessage && isEmpty) {
          const msgBodyNode = document.createElement('img');

          if (message.attachments[0].hasOwnProperty('previewUrl')) {
            msgBodyNode.setAttribute('src', message.attachments[0].previewUrl);
          }

          msgBodyNode.setAttribute('alt', 'can\'t display attachment');
          msgBodyNode.classList.add('chat-message-attachment');

          msgContainer.appendChild(msgBodyNode);
        } else if (isEvent) {
          const msgBodyNode = document.createElement('span');
          msgBodyNode.classList.add('chat-message-body');

          const msgBodyTextNode = document.createTextNode('(event)');
          msgBodyNode.appendChild(msgBodyTextNode);

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
      }
      setTimeout(() => this.scrollToBottom(), 1000);
    },
    cleanChatBrowser(): void {
      while (this.chatBrowser.firstChild) {
        this.chatBrowser.removeChild(this.chatBrowser.firstChild);
      }
    },
    scrollToBottom(): void {
      this.chatBrowser.scrollTop = this.chatBrowser.scrollHeight;
    },
    setUpRequest(): void {
      this.request = new XMLHttpRequest;

      this.request.onerror = () => {
        console.error('Server error dealing with the chat');
      };
    },
    loadMessages(upTo: number, after: number, amount: number): void {
      this.setUpRequest();

      if (amount === undefined) {
        amount = this.settings.messagesPerLoad;
      }

      let url = `/api/get-messages`;

      if (after) {
        url += `?after=${after}`;
      } else if (upTo) {
        url += `?up_to=${upTo}`;
      } else {
        url += `?up_to=${new Date().getTime()}`;
      }

      this.request.open('GET', url);

      this.request.onload = () => {
        if (this.request.status>= 200 && this.request.status < 400) {
          this.messages = JSON.parse(this.request.responseText);
          this.messages = this.messages.reverse();

          console.log(this.messages);

          this.render();
        } else {
          console.error('Server returned an error');
        }
      };

      this.request.send();
    },
    loadFirstPage(): void {
      this.loadMessages(undefined, undefined, undefined);
    },
    loadPrevPage(): void {
      this.loadMessages(this.messages[0].timestamp, undefined, undefined);
    },
    loadNextPage(): void {
      this.loadMessages(undefined, this.messages[this.messages.length - 1].timestamp, undefined);
    },
    loadLastPage(): void {
      this.loadMessages(9999999999999, undefined, undefined);
    }
  };

  chat.init();
});
