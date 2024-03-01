import Conversation from "../conversations/conversation";
import Person from "../new/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Search() {
  const arr = [
    {
      name: "John Doe",
      username: "jake123",
      avatar: "",
    },
    {
      name: "Kitty Oppenheimer",
      username: "jake123",
      avatar: "",
    },
    {
      name: "Robert J. Oppenheimer",
      username: "jake123",
      avatar: "",
    },
  ];
  return (
    <div className="w-full pt-2">
      <Tabs defaultValue="conversations">
        <div className="w-full px-5">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="conversations">
          {arr.map((conversation, index) => (
            <Conversation
              name={conversation.name}
              date={new Date()}
              unreadMessages={12}
              message="Hello World! This is a test message."
              avatar=""
              key={index}
              conversationType="group"
              id={index.toString()}
            />
          ))}
        </TabsContent>
        <TabsContent value="people">
          {arr.map((person, index) => (
            <Person
              name={person.name}
              username={person.username}
              avatar={person.avatar}
              key={index}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
