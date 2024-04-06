import Person from "../new/person";
import ResponsiveDialog from "@/components/looks/responsive-dialog";
import TableRow from "../table-row";
import { MdGroup, MdContacts } from "react-icons/md";
import NewContactForm from "../new/new-contact-form";
import NewGrp from "../new/new-grp";

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
          name={person.name}
          username={person.username}
          avatar={person.avatar}
          key={index}
        />
      ))}
    </>
  );
}
