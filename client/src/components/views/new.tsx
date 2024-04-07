import { Person } from "../person";
import ResponsiveDialog from "../responsive-dialog";
import TableRow from "../table-row";
import { MdGroup, MdContacts } from "react-icons/md";
import NewContactForm from "../forms/new-contact-form";

import { useState } from "react";
import NewGroupForm from "../forms/new-grp-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarName } from "@/lib/formatting";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { ContactType, GroupType } from "@/types";
import { a } from "@/data";
import { Button } from "../ui/button";
import { Check, Loader } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function New() {
  const arr = [
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
  ];
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

      <TableRow title="Contacts" className="pl-5 hover:bg-transparent" />
      {arr.map((person, index) => (
        <Person
          id={person.id}
          name={person.name}
          username={person.username}
          avatar={person.avatar}
          key={index}
        />
      ))}
    </>
  );
}

function AddMembers(props: GroupType) {
  const [added, setAdded] = useState<ContactType[]>([]);
  const [result, setResult] = useState<ContactType[]>(a);
  const [submitting, setIsSubmitting] = useState(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setResult(
      a.filter((person: ContactType) => {
        return person.name.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  }
  function addToGrp(newPerson: ContactType) {
    const isAdded = added.filter((person) => {
      return newPerson.name === person.name;
    });
    if (isAdded.length) {
      setAdded((prev) =>
        prev.filter((person) => {
          return newPerson.name !== person.name;
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
  function createGroup() {
    setIsSubmitting(true);
    console.log(props.name);
    setIsSubmitting(false);
  }
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
        <ScrollArea className="h-32 md:h-72">
          {result.map((person, index) => (
            <div
              onClick={() => addToGrp(person)}
              key={index}
              className="relative"
            >
              <Person
                name={person.name}
                username={person.username}
                avatar={person.avatar}
                id={person.id}
              />
              {true && (
                <Check className="absolute top-5 right-4 text-primary" />
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="space-y-3">
        <p className="text-sm+">Added Members</p>
        <ScrollArea className="md:max-w-md">
          <div className="flex gap-2 mb-[10px]">
            {added.map((person, index) => (
              <Avatar className="h-11 w-11" key={index}>
                <AvatarImage src={person.avatar} alt={person.name} />
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

function NewGrp() {
  const [step, setStep] = useState(1);
  const [grpDetails, setGrpDetails] = useState<GroupType>({
    name: "",
    avatar: "",
    id: "",
  });
  return (
    <div>
      {step === 1 && (
        <NewGroupForm setStep={setStep} setGrpDetails={setGrpDetails} />
      )}
      {step === 2 && (
        <AddMembers avatar={grpDetails.avatar} id="" name={grpDetails.name} />
      )}
    </div>
  );
}
