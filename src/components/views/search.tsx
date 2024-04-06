import { useEffect, useState } from "react";
import Conversation from "../conversations/conversation";
import Person from "../new/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearch } from "@/store";

export default function Search() {
  const [arr, setArr] = useState([
    {
      name: "Robert J. Oppenheimer",
      username: "jake123",
      avatar: "",
    },
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
  ]);
  const [results, setResults] = useState([
    {
      name: "Robert J. Oppenheimer",
      username: "jake123",
      avatar: "",
    },
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
  ]);
  const { searchTerm } = useSearch();
  useEffect(() => {
    setResults(arr.filter((person) => {
      return person.name.toLowerCase().includes(searchTerm.toLowerCase());
    }))
  }, [searchTerm]);
  return (
    <div className="w-full">
      <Tabs defaultValue="conversations">
        <div className="w-full px-4 py-2 bg-background sticky top-32 inset-x-0 z-40">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="conversations" className="mt-0">
          {results.map((conversation, index) => (
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
        <TabsContent value="people" className="mt-0">
          {results.map((person, index) => (
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
