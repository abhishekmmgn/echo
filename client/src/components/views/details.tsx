import { useCurrentConversation, useCurrentView } from "@/store";
import { MdChevronLeft } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import getId, { formatAvatarName, noConversation } from "@/lib/utils";
import { Button } from "../ui/button";
import { Person } from "../person";
import { ScrollArea } from "../ui/scroll-area";
import File from "../file";
import api from "@/api/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ContactType } from "@/types";
import { Pencil } from "lucide-react";
import ResponsiveDialog from "../responsive-dialog";
import { EditGroupForm, EditMembers } from "../edit-group";

export default function Details() {
  const { conversation, changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();
  const [details, setDetails] = useState<{
    participants: [] | null;
    isAdmin: boolean | null;
    files: [] | null;
  }>({
    participants: null,
    isAdmin: null,
    files: null,
  });

  console.log("D: ", conversation.conversationId);
  async function deleteConversation() {
    try {
      const res = await api.delete(
        `/conversations/${conversation.conversationId}`
      );
      if (res.status === 200) {
        changeCurrentConversation(noConversation);
        changeView("home");
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong");
    }
  }
  async function blockPerson() {
    try {
      const res = await api.put(
        `/contacts/${conversation.participants[0]}?id=${getId()}`,
        {
          block: true,
        }
      );
      console.log(res.status);
      if (res.status === 200) {
        toast("Blocked successfully");
        changeCurrentConversation(noConversation);
        changeView("home");
      }
    } catch (error) {
      console.log(error);
      toast("Someting went wrong");
    }
  }
  async function exitGroup() {
    try {
      const res = await api.put(`/conversations/?id=${getId()}`, {
        operation: "EXIT_GROUP",
        conversationId: conversation.conversationId,
      });
      console.log(res);
      if (res.status === 200) {
        toast("Group exitedd successfully");
        changeCurrentConversation(noConversation);
        changeView("home");
      }
    } catch (error) {
      console.log(error);
      toast("Someting went wrong");
    }
  }
  async function fetchDetails() {
    try {
      const res = await api.get(
        `/conversations/${conversation.conversationId}/details?id=${getId()}`
      );
      const data = res.data.data;
      console.log(data);
      setDetails(data);
      changeCurrentConversation({
        ...conversation,
        // participants: data.participants,
      });
    } catch (error) {
      console.log(error);
      toast("Something went wrong while getting details.");
    }
  }
  useEffect(() => {
    fetchDetails();
  }, []);
  return (
    <div className="overflow-y-scroll">
      <div className="fixed inset-x-0 z-10 top-0 w-full h-12 text-muted-foreground flex items-end gap-5 px-4 bg-background md:sticky">
        <MdChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => changeView("message-room")}
        />
      </div>
      <div className="sm:mt-5 pb-5 max-w-xl mx-auto space-y-10">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-28 h-28 bg-secondary rounded-full sm:w-28 sm:h-28 text-5xl sm:text-6xl">
            <AvatarImage
              src={conversation.avatar || ""}
              alt={conversation.name || ""}
            />
            <AvatarFallback>
              {formatAvatarName(conversation.name || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex gap-5 items-center">
              <h2
                className={`${
                  conversation.conversationType === "GROUP" && "ml-10"
                } mt-1 text-center capitalize font-medium text-2xl lg:text-3xl`}
              >
                {conversation.name}
              </h2>
              {conversation.conversationType === "GROUP" && (
                <ResponsiveDialog
                  title="Edit Group"
                  trigger={
                    <Pencil className="cursor-pointer text-muted-foreground hover:text-primary" />
                  }
                  body={<EditGroupForm />}
                />
              )}
            </div>
            <p className="text-center lowercase md:text-base+ text-muted-foreground">
              {conversation.email}
            </p>
          </div>
        </div>
        {details.files?.length && (
          <div className="px-4 space-y-2">
            <div className="flex justify-between px-4">
              <p className="text-lg+ md:text-xl font-medium">Files Shared</p>
              <p className="text-primary md:text-base+ font-medium">
                {details.files?.length}
              </p>
            </div>
            <ScrollArea className="max-h-80 py-1 border rounded-[--radius] shadow-sm">
              {details.files?.map(
                (item: { name: string; url: string }, index) => (
                  <File name={item.name} url={item.url} key={index} />
                )
              )}
            </ScrollArea>
          </div>
        )}
        {conversation.conversationType === "GROUP" && (
          <div className="px-4 space-y-2">
            <div className="flex items-center justify-between px-4">
              <p className="text-lg+ md:text-xl font-medium">Group Members</p>
              <div className="w-fit">
                <ResponsiveDialog
                  title="Edit Group"
                  trigger={
                    <Pencil className="cursor-pointer text-muted-foreground hover:text-primary" />
                  }
                  body={<EditMembers />}
                />
              </div>
            </div>
            <ScrollArea className="max-h-80 py-1 border rounded-[--radius] shadow-sm">
              {details.participants?.map((person: ContactType) => (
                <div className="pointer-events-none" key={person.id}>
                  <Person
                    name={person.name}
                    email={person.email}
                    avatar={person.avatar}
                    id={person.id}
                    blocked={person.blocked}
                    hasConversation={person.hasConversation}
                  />
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        <div className="px-4 space-y-3">
          {conversation.conversationType === "GROUP" ? (
            details.isAdmin ? (
              <Button variant="destructive" onClick={deleteConversation}>
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
    </div>
  );
}