export type ContactType = {
  name: string;
  avatar: string | undefined;
  username: string;
  uid: string;
};

export type GroupType = {
  name: string;
  avatar: string | undefined;
  id: string;
};

export type FileType = {
  name: string;
  size?: number;
}