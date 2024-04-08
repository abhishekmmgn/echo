import { useEffect, useState } from "react";
import { Conversation } from "../conversation";
import { Person, PersonSkeleton } from "../person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearch } from "@/store";
import { ContactType } from "@/types";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import getId from "@/lib/utils";

// CONVERSATION
export default function Search() {
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  // const [filteredConversations, setFilteredConversations] = useState<>([]);
  const { searchTerm } = useSearch();

  // const {
  //   data: contactsData,
  //   isLoading: isContactsLoading,
  //   isError: isContactsError,
  //   error: contactsError,
  // } = useQuery({
  //   queryKey: ["conversations"],
  //   queryFn: async () => {
  //     const res = await api.get(`/contacts?id=${getId()}`);
  //     return res.data.data;
  //   },
  // });
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
        })
      );
    }
    if (searchTerm.length === 0) {
      setFilteredContacts(contactsData);
    }
  }, [searchTerm]);

  useEffect(() => {
    setFilteredContacts(contactsData);
  }, [contactsData]);

  if (isContactsError) {
    console.log(contactsError);
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
          {/* {results.map((conversation, index) => (
            <Conversation
              name={conversation.name}
              date={new Date()}
              unreadMessages={12}
              message="Hello World! This is a test message."
              avatar=""
              key={index}
              type="group"
              id={index.toString()}
            />
          ))} */}
        </TabsContent>
        <TabsContent value="people" className="mt-0">
          {isContactsLoading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <PersonSkeleton key={idx} />
            ))}
          {contactsData &&
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
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
