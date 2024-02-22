import Person from "../new/person";
import TableRow from "../looks/table-row";
import { MdGroup, MdContacts } from "react-icons/md";

export default function New() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <>
      <TableRow
        title="New Contact"
        icon={<MdGroup className="text-xl" />}
        text="New Contact"
      >
        lkdkf
      </TableRow>
      <TableRow
        title="New Group"
        icon={<MdContacts className="text-lg" />}
        text="New Contact"
      >
        kjdkdf
      </TableRow>

      {arr.map(() => (
        <Person />
      ))}
    </>
  );
}
