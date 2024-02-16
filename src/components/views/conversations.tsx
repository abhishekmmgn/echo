import Conversation from "../conversations/conversation";
import NavbarWrapper, { DefaultNavbar } from "../navigation/navbar";

export default function Conversations() {
  const conversations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      <NavbarWrapper height="128px">
        <DefaultNavbar />
      </NavbarWrapper>
      <div className="pt-32 md:pt-0">
        {conversations.map(() => (
          <Conversation />
        ))}
      </div>
    </>
  );
}
