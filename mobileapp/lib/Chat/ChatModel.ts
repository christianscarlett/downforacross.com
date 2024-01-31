import Message from './Message';

class ChatModel {
  private messages: Message[] = [];

  pushMessage(senderId: string, message: string, timestamp: number) {
    this.messages.push({
      senderId,
      text: message,
      timestamp,
    });
  }

  getMessages() {
    this.messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    return this.messages;
  }
}

export default ChatModel;
