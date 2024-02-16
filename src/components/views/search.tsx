import Conversation from "../conversations/conversation";
import NavbarWrapper, { DefaultNavbar } from "../navigation/navbar";
import Person from "../new/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Search() {
  const arr = [1, 2, 3, 4, 5, 6];
  return (
    <>
      <NavbarWrapper height="128px">
        <DefaultNavbar />
      </NavbarWrapper>
      <div className="w-full pt-2">
        <Tabs defaultValue="conversations">
          <div className="w-full px-5">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="conversations">
            {arr.map(() => (
              <Conversation />
            ))}
          </TabsContent>
          <TabsContent value="people">
            {arr.map(() => (
              <Person />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
