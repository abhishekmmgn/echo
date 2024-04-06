import Person from "./person";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarName } from "@/lib/formatting";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { ContactType, GroupType } from "@/types";
import { a } from "@/data";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function AddMembers(props: GroupType) {
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
    console.log(props.name)
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
            <div onClick={() => addToGrp(person)} key={index}>
              <Person
                name={person.name}
                username={person.username}
                avatar={person.avatar}
                uid={person.uid}
              />
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
