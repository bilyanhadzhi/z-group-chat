document.addEventListener('DOMContentLoaded', function () {
    var chat = {
        init: function () {
            this.scrollToBottom();
        },
        scrollToBottom: function () {
            var chatDiv = document.getElementById('chat-browser');
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    };
    chat.init();
});
