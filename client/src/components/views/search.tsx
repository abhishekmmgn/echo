import api from "@/api/axios";
import { getId } from "@/lib/utils";
import { useSearch } from "@/store";
import { ContactType, ConversationType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Conversation } from "../conversation";
import { Person, PersonSkeleton } from "../person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// CONVERSATION
export default function Search() {
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationType[]
  >([]);
  const { searchTerm } = useSearch();

  const {
    data: conversationsData,
    isLoading: isConversationsLoading,
    isError: isConversationsError,
    error: conversationsError,
  } = useQuery({
    queryKey: ["all-conversations"],
    queryFn: async () => {
      const res = await api.get(`conversations?id=${getId()}`);
      return res.data.data;
    },
  });
  const {
    data: contactsData,
    isLoading: isContactsLoading,
    isError: isContactsError,
    error: contactsError,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await api.get(`/contacts?id=${getId()}`);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (contactsData) {
      setFilteredContacts(
        contactsData.filter((person: ContactType) => {
          return person.name.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      );
    }
    if (searchTerm.length === 0) {
      setFilteredContacts(contactsData);
    }
  }, [searchTerm]);
  useEffect(() => {
    setFilteredContacts(contactsData);
  }, [contactsData]);

  useEffect(() => {
    if (conversationsData) {
      setFilteredConversations(
        conversationsData.filter((person: ConversationType) => {
          return person.name.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      );
    }
    if (searchTerm.length === 0) {
      setFilteredConversations(conversationsData);
    }
  }, [searchTerm]);

  useEffect(() => {
    setFilteredConversations(conversationsData);
  }, [conversationsData]);

  if (isContactsError || isConversationsError) {
    console.log(contactsError, conversationsError);
  }
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
          {isConversationsLoading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <PersonSkeleton key={idx} />
            ))}
          {isConversationsError && (
            <div className="h-[80vh] w-full grid place-items-center">
              <p className="text-destructive">Something went wrong.</p>
            </div>
          )}
          {conversationsData && conversationsData.length > 0 ? (
            filteredConversations.map((conversation: ConversationType) => (
              <Conversation
                id={conversation.id}
                name={conversation.name}
                lastMessage={conversation.lastMessage}
                lastMessageTime={conversation.lastMessageTime}
                lastMessageType={conversation.lastMessageType}
                avatar={conversation.avatar}
                type={conversation.type}
                key={conversation.id}
              />
            ))
          ) : (
            <div className="h-[40vh] w-full grid place-items-center">
              <p>No conversations.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="people" className="mt-0">
          {isContactsLoading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <PersonSkeleton key={idx} />
            ))}
          {isContactsError && (
            <div className="h-[80vh] w-full grid place-items-center">
              <p className="text-destructive">Something went wrong.</p>
            </div>
          )}
          {contactsData && contactsData.length > 0 ? (
            filteredContacts?.map((person: ContactType) => (
              <Person
                id={person.id}
                name={person.name}
                email={person.email}
                avatar={person.avatar}
                blocked={person.blocked}
                hasConversation={person.hasConversation}
                key={person.id}
              />
            ))
          ) : (
            <div className="h-[40vh] w-full grid place-items-center">
              <p>No contacts.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
