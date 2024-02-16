import NavbarWrapper, { NewNavbar } from "../navigation/navbar";
import Person from "../new/person";
import TableRow from "../looks/table-row";
import { MdGroup, MdContacts } from "react-icons/md";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function New() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <>
      <NavbarWrapper height="64px">
        <NewNavbar />
      </NavbarWrapper>
      <div className="pt-16 md:pt-0">
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
      </div>
    </>
  );
}
