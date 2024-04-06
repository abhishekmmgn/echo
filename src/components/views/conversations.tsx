import Conversation from "../conversations/conversation";

export default function Conversations() {
  const conversations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      {conversations.map((index) => (
        <Conversation
          name="John Doe"
          date={new Date()}
          message="Hello World! This is a test message."
          unreadMessages={12}
          avatar=""
          conversationType="personal"
          id={index.toString()}
          key={index}
        />
      ))}
    </>
  );
}
