import { useCurrentConversation, useCurrentView } from "@/store";
import { MdChevronLeft } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatAvatarName } from "@/lib/formatting";
import { Button } from "../ui/button";
import { a } from "@/data";
import { Person } from "../person";
import { ScrollArea } from "../ui/scroll-area";
import File from "../file";

export default function Details() {
  const { name, avatar, conversationType, changeCurrentConversation } =
    useCurrentConversation();
  const { changeView } = useCurrentView();
  function deleteConversation() {
    // delete conversation
    changeCurrentConversation("", "", "", undefined);
    changeView("home");
  }
  function blockPerson() {
    // block person
    changeCurrentConversation("", "", "", undefined);
    changeView("home");
  }
  function exitGroup() {}
  function deleteGroup() {}
  const isAdmin = true;
  return (
    <div>
      <div className="fixed inset-x-0 z-10 top-0 w-full h-12 text-muted-foreground flex items-end gap-5 px-4 bg-background md:sticky">
        <MdChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => changeView("message-room")}
        />
      </div>
      <ScrollArea className="sm:mt-5 pb-5">
        <div className="max-w-xl mx-auto space-y-10">
          <div className="flex flex-col items-center gap-1">
            <Avatar className="w-28 h-28 bg-secondary rounded-full sm:w-28 sm:h-28 text-5xl sm:text-6xl">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{formatAvatarName(name)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-1 text-center capitalize font-medium text-2xl lg:text-3xl">
              {name}
            </h2>
            <p className="text-center lowercase md:text-base+ text-muted-foreground">
              {"abhishekmmng"}
            </p>
          </div>
          {/* <div className="px-4 space-y-2">
            <div className="flex justify-between px-4">
              <p className="text-lg+ md:text-xl font-medium">Files Shared</p>
              <p className="text-primary md:text-base+ font-medium">8</p>
            </div>
            <ScrollArea className="h-80 py-1 border rounded-[--radius] shadow-sm">
              {a.map((person, index) => (
                <File name={person.name} size={index} key={index} />
              ))}
            </ScrollArea>
          </div> */}
          {conversationType === "group" && (
            <div className="px-4 space-y-2">
              <div className="flex justify-between px-4">
                <p className="text-lg+ md:text-xl font-medium">Group Members</p>
                <p className="text-primary md:text-base+ font-medium">12</p>
              </div>
              <ScrollArea className="h-80 py-1 border rounded-[--radius] shadow-sm">
                {a.map((person, index) => (
                  <Person
                    name={person.name}
                    username={person.username}
                    avatar={person.avatar}
                    id={person.id}
                    key={index}
                  />
                ))}
              </ScrollArea>
            </div>
          )}
          <div className="px-4 space-y-3">
            {conversationType === "group" ? (
              isAdmin ? (
                <Button variant="destructive" onClick={deleteGroup}>
                  Delete Group
                </Button>
              ) : (
                <Button variant="secondary" onClick={exitGroup}>
                  Exit Group
                </Button>
              )
            ) : (
              <>
                <Button variant="secondary" onClick={deleteConversation}>
                  Delete Conversation
                </Button>
                <Button variant="destructive" onClick={blockPerson}>
                  Block Person
                </Button>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
