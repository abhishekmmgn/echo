import Conversation from "../conversations/conversation";
import Person from "../new/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Search() {
  const arr = [1, 2, 3, 4, 5, 6];
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
          {arr.map((index) => (
            <Conversation key={index} />
          ))}
        </TabsContent>
        <TabsContent value="people">
          {arr.map((index) => (
            <Person key={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
