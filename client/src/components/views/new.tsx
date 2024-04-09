import { Person, PersonSkeleton } from "../person";
import ResponsiveDialog from "../responsive-dialog";
import TableRow from "../table-row";
import { MdGroup, MdContacts } from "react-icons/md";
import NewContactForm from "../forms/new-contact-form";
import { useEffect, useState } from "react";
import GroupForm from "../forms/grp-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getId, { formatAvatarName } from "@/lib/utils";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { ContactType, ConversationStateType } from "@/types";
import { Button } from "../ui/button";
import { Check, Loader } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useCurrentView, useCurrentConversation } from "@/store";

export default function New() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await api.get(`/contacts?id=${getId()}`);
      return res.data.data;
    },
  });
  console.log(data);
  if (isError) {
    console.log(error);
  }
  return (
    <>
      <ResponsiveDialog
        trigger={
          <TableRow icon={<MdGroup className="text-xl" />} title="New Group" />
        }
        title="New Group"
        description="Create a new group"
        body={<NewGrp />}
      />
      <ResponsiveDialog
        trigger={
          <TableRow
            icon={<MdContacts className="text-lg" />}
            title="New Contact"
          />
        }
        title="New Contact"
        description="Add a new contact"
        body={<NewContactForm />}
      />
      <TableRow
        title="Contacts"
        className="pl-5 hover:bg-transparent border-none"
      />
      {isLoading &&
        Array.from({ length: 10 }).map((_, idx) => (
          <PersonSkeleton key={idx} />
        ))}
      {isError && (
        <div className="h-[80vh] w-full grid place-items-center">
          <p className="text-destructive">Something went wrong.</p>
        </div>
      )}
      {data &&
        data.map((person: ContactType) => (
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
    </>
  );
}

type GroupType = {
  name: string;
  avatar: string | null;
};

function AddMembers(props: GroupType) {
  const { changeView } = useCurrentView();
  const { changeCurrentConversation } = useCurrentConversation();
  const [added, setAdded] = useState<ContactType[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ContactType[]>([]);
  const [submitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await api.get(`/contacts?id=${getId()}`);
      return res.data.data;
    },
  });

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setFilteredMembers(
      data.filter((person: ContactType) => {
        return person.name.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  }
  function addToGrp(newPerson: ContactType) {
    const isAdded = added.filter((person) => {
      return newPerson.id === person.id;
    });
    console.log(isAdded);
    if (isAdded.length) {
      setAdded((prev) =>
        prev.filter((person) => {
          return newPerson.id !== person.id;
        })
      );
      return;
    } else {
      if (added.length < 128) {
        setAdded((prev) => [
          ...prev,
          {
            ...newPerson,
          },
        ]);
      } else {
        toast("Group limit reached.");
      }
    }
  }
  async function createGroup() {
    setIsSubmitting(true);
    const participants = added.map((person) => person.id);
    try {
      const res = await api.post(`/conversations?id=${getId()}`, {
        participants,
        conversationType: "GROUP",
        name: props.name,
        avatar: props.avatar,
      });
      const data = res.data;
      console.log(data);

      const newConversation: ConversationStateType = {
        conversationId: data.conversationId,
        name: props.name,
        avatar: props.avatar,
        email: null,
        participants: [...participants, getId()],
        conversationType: "GROUP",
        hasConversation: null,
      };
      changeCurrentConversation(newConversation);
      changeView("message-room");
    } catch (err) {
      console.log(err);
      toast("Error creating group.");
    }
    console.log(props.name);
    setIsSubmitting(false);
  }

  if (isError) console.log(error);
  return (
    <div className="px-4 space-y-4">
      <div className="rounded-lg border shadow-md">
        <div className="p-2">
          <Input
            type="search"
            placeholder="Type a name or search..."
            onChange={handleSearch}
          />
        </div>
        {isLoading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <PersonSkeleton key={idx} />
          ))}
        {isError && (
          <div className="h-[80vh] w-full grid place-items-center">
            <p className="text-destructive">Something went wrong.</p>
          </div>
        )}
        {data && (
          <ScrollArea className="h-32 md:h-72">
            {filteredMembers.map((person: ContactType) => (
              <div
                onClick={() => addToGrp(person)}
                key={person.id}
                className="relative cursor-pointer"
              >
                <div className="pointer-events-none">
                  <Person
                    name={person.name}
                    email={person.email}
                    avatar={person.avatar}
                    id={person.id}
                    blocked={person.blocked}
                    hasConversation={person.hasConversation}
                  />
                </div>
                {added.some((item) => item.id === person.id) && (
                  <Check className="absolute top-5 right-4 text-primary" />
                )}
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
      <div className="space-y-3">
        <p className="text-sm+">Added Members</p>
        <ScrollArea className="md:max-w-md">
          <div className="flex gap-2 mb-[10px]">
            {added.map((person: ContactType) => (
              <Avatar className="h-11 w-11" key={person.id}>
                <AvatarImage src={person.avatar || ""} alt={person.name} />
                <AvatarFallback className="text-xl">
                  {formatAvatarName(person.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Button disabled={added.length === 0 || submitting} onClick={createGroup}>
        {submitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
        Done
      </Button>
    </div>
  );
}

export function NewGrp() {
  const [step, setStep] = useState(1);
  const [grpDetails, setGrpDetails] = useState<GroupType>({
    name: "",
    avatar: null,
  });
  return (
    <div>
      {step === 1 && (
        <GroupForm setStep={setStep} setGrpDetails={setGrpDetails} />
      )}
      {step === 2 && (
        <AddMembers avatar={grpDetails.avatar} name={grpDetails.name} />
      )}
    </div>
  );
}
