import Conversation from "../conversations/conversation";

export default function Conversations() {
  const conversations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      {conversations.map(() => (
        <Conversation />
      ))}
    </>
  );
}
