document.addEventListener('DOMContentLoaded', function () {
    var chat = {
        messages: [],
        settings: {
            messagesPerLoad: 50
        },
        cacheDom: function () {
            this.chatBrowser = document.getElementById('chat-browser');
            this.buttons = {
                first: document.getElementById('first-button'),
                prev: document.getElementById('prev-button'),
                next: document.getElementById('next-button'),
                last: document.getElementById('last-button')
            };
        },
        init: function () {
            this.cacheDom();
            this.bindEvents();
            this.scrollToBottom();
            this.loadMessages(undefined, undefined, undefined);
        },
        bindEvents: function () {
            this.buttons.first.addEventListener('click', this.loadFirstPage.bind(this));
            this.buttons.prev.addEventListener('click', this.loadPrevPage.bind(this));
            this.buttons.next.addEventListener('click', this.loadNextPage.bind(this));
            this.buttons.last.addEventListener('click', this.loadLastPage.bind(this));
        },
        render: function () {
            var _this = this;
            this.cleanChatBrowser();
            this.messages.forEach(function (message) {
                var msgContainer = document.createElement('div');
                msgContainer.classList.add('chat-message-container');
                var authorImgNode = document.createElement('img');
                authorImgNode.setAttribute('src', "https://graph.facebook.com/" + message.senderID + "/picture?height=64&width=64");
                authorImgNode.setAttribute('alt', 'img');
                authorImgNode.classList.add('chat-image');
                msgContainer.appendChild(authorImgNode);
                var isTextMessage = message.type === 'message';
                var isEvent = message.type === 'event';
                var isEmpty = message.body === '';
                if (isTextMessage && !isEmpty) {
                    var msgBodyNode = document.createElement('span');
                    msgBodyNode.classList.add('chat-message-body');
                    var msgBodyTextNode = document.createTextNode(message.body);
                    msgBodyNode.appendChild(msgBodyTextNode);
                    msgContainer.appendChild(msgBodyNode);
                }
                else if (isTextMessage && isEmpty) {
                    var msgBodyNode = document.createElement('img');
                    if (message.attachments[0].hasOwnProperty('previewUrl')) {
                        msgBodyNode.setAttribute('src', message.attachments[0].previewUrl);
                    }
                    msgBodyNode.setAttribute('alt', 'can\'t display attachment');
                    msgBodyNode.classList.add('chat-message-attachment');
                    msgContainer.appendChild(msgBodyNode);
                }
                else if (isEvent) {
                    var msgBodyNode = document.createElement('span');
                    msgBodyNode.classList.add('chat-message-body');
                    var msgBodyTextNode = document.createTextNode('(event)');
                    msgBodyNode.appendChild(msgBodyTextNode);
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
            setTimeout(function () { return _this.scrollToBottom(); }, 1000);
        },
        cleanChatBrowser: function () {
            while (this.chatBrowser.firstChild) {
                this.chatBrowser.removeChild(this.chatBrowser.firstChild);
            }
        },
        scrollToBottom: function () {
            this.chatBrowser.scrollTop = this.chatBrowser.scrollHeight;
        },
        setUpRequest: function () {
            this.request = new XMLHttpRequest;
            this.request.onerror = function () {
                console.error('Server error dealing with the chat');
            };
        },
        loadMessages: function (upTo, after, amount) {
            var _this = this;
            this.setUpRequest();
            if (amount === undefined) {
                amount = this.settings.messagesPerLoad;
            }
            var url = "/api/get-messages";
            if (after) {
                url += "?after=" + after;
            }
            else if (upTo) {
                url += "?up_to=" + upTo;
            }
            else {
                url += "?up_to=" + new Date().getTime();
            }
            this.request.open('GET', url);
            this.request.onload = function () {
                if (_this.request.status >= 200 && _this.request.status < 400) {
                    _this.messages = JSON.parse(_this.request.responseText);
                    _this.messages = _this.messages.reverse();
                    console.log(_this.messages);
                    _this.render();
                }
                else {
                    console.error('Server returned an error');
                }
            };
            this.request.send();
        },
        loadFirstPage: function () {
            this.loadMessages(undefined, undefined, undefined);
        },
        loadPrevPage: function () {
            this.loadMessages(this.messages[0].timestamp, undefined, undefined);
        },
        loadNextPage: function () {
            this.loadMessages(undefined, this.messages[this.messages.length - 1].timestamp, undefined);
        },
        loadLastPage: function () {
            this.loadMessages(9999999999999, undefined, undefined);
        }
    };
    chat.init();
});
