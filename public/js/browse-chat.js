document.addEventListener('DOMContentLoaded', function () {
    var chat = {
        messages: [],
        settings: {
            messagesCount: 50
        },
        cacheDom: function () {
            this.chatBrowser = document.getElementById('chat-browser');
        },
        init: function () {
            this.cacheDom();
            this.scrollToBottom();
            this.loadMessages();
        },
        render: function () {
            var _this = this;
            this.cleanChatBrowser();
            this.messages.forEach(function (message) {
                var msgContainer = document.createElement('div');
                msgContainer.classList.add('chat-message-container');
                var authorImgNode = document.createElement('img');
                authorImgNode.setAttribute('src', message.senderThumbSrc);
                authorImgNode.setAttribute('alt', 'img');
                authorImgNode.classList.add('profile-image');
                msgContainer.appendChild(authorImgNode);
                var isTextMessage = message.type === 'message' && message.body !== '';
                if (isTextMessage) {
                    var msgBodyNode = document.createElement('span');
                    msgBodyNode.classList.add('chat-message-body');
                    var msgBodyTextNode = document.createTextNode(message.body);
                    msgBodyNode.appendChild(msgBodyTextNode);
                    msgContainer.appendChild(msgBodyNode);
                }
                else {
                    var msgBodyNode = document.createElement('img');
                    msgBodyNode.setAttribute('src', message.attachments[0].previewUrl);
                    msgBodyNode.setAttribute('alt', 'attachment');
                    msgBodyNode.classList.add('chat-message-attachment');
                    msgContainer.appendChild(msgBodyNode);
                }
                var timeNode = document.createElement('span');
                timeNode.classList.add('chat-message-timestamp');
                var formattedTime = "" + new Date(message.timestamp).toLocaleTimeString('bg-BG', { timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit' });
                var timeTextNode = document.createTextNode(formattedTime);
                timeNode.appendChild(timeTextNode);
                msgContainer.appendChild(timeNode);
                _this.chatBrowser.appendChild(msgContainer);
            });
            var lastMsg = this.messages[this.messages.length - 1];
            if (lastMsg.body === '' && lastMsg.type === 'message') {
                var lastImgNode = this.chatBrowser.childNodes[this.chatBrowser.childNodes.length - 1];
                lastImgNode.childNodes[1].addEventListener('load', function () { return _this.scrollToBottom(); });
            }
            else {
                this.scrollToBottom();
            }
        },
        cleanChatBrowser: function () {
            while (this.chatBrowser.firstChild) {
                this.chatBrowser.removeChild(this.chatBrowser.firstChild);
            }
        },
        scrollToBottom: function () {
            var chatDiv = document.getElementById('chat-browser');
            chatDiv.scrollTop = chatDiv.scrollHeight;
        },
        setUpRequest: function () {
            this.request = new XMLHttpRequest;
            this.request.onerror = function () {
                console.error('Server error dealing with the chat');
            };
        },
        loadMessages: function () {
            var _this = this;
            this.setUpRequest();
            var unixDate = +new Date();
            var amount = this.settings.messagesCount;
            this.request.open('GET', "/api/get-messages?before=" + unixDate + "&amount=" + amount);
            this.request.onload = function () {
                if (_this.request.status >= 200 && _this.request.status < 400) {
                    _this.messages = JSON.parse(_this.request.responseText);
                    _this.messages = _this.messages.reverse();
                    _this.render();
                }
                else {
                    console.error('Server returned an error');
                }
            };
            this.request.send();
        }
    };
    chat.init();
});
