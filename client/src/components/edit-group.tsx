import { Person, PersonSkeleton } from "./person";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getId, formatAvatarName } from "@/lib/utils";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ContactType, ConversationStateType } from "@/types";
import { Button } from "./ui/button";
import { Check, Loader } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import api from "@/api/axios";
import { useCurrentConversation } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { storage } from "@/lib/firebase-config";
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
  avatar: z.string().optional(),
});

export function EditGroupForm() {
  const { conversation, changeCurrentConversation } = useCurrentConversation();
  const [fileUploading, setFileUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    conversation.avatar
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: conversation.name!,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      const res = await api.put(`/conversations/?id=${getId()}`, {
        conversationId: conversation.conversationId,
        operation: "EDIT_DETAILS",
        name: values.name,
        avatar: avatarUrl || null,
      });
      console.log(res.data.data);
      if (res.status === 200) {
        const newConv: ConversationStateType = {
          ...conversation,
          name: values.name,
          avatar: avatarUrl || null,
        };
        changeCurrentConversation(newConv);
        form.reset();
      }
    } else {
      toast(
        "You have reached the maximum number of attempts. Please try again later."
      );
    }
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const oldFileUrl = avatarUrl;

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 256) {
        toast("File size must be less than 256KB.");
        return;
      }
      setFileUploading(true);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);

      const avatarsRef = ref(
        storage,
        "groupAvatars/" + `${file.name}-${Date.now()}`
      );
      uploadBytes(avatarsRef, file).then((snapshot) => {
        console.log("Image uploaded!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setAvatarUrl(downloadURL);
          setFileUploading(false);
        });
        toast("Image uploaded!");
      });
      // delete old avatar
      if (oldFileUrl) {
        const oldFileRef = ref(storage, "avatars/" + oldFileUrl);
        deleteObject(oldFileRef)
          .then(() => {
            console.log("File deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-4">
        <Avatar
          className={`h-24 w-24 bg-secondary mx-auto ${
            fileUploading && "opacity-80"
          }`}
        >
          <AvatarImage src={avatarUrl || ""} alt="Group photo" />
        </Avatar>
        <FormField
          control={form.control}
          disabled={isSubmitting}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={onFileChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={isSubmitting}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Meme Team" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.getValues("name") || isSubmitting || fileUploading}
          className="mt-2"
        >
          {isSubmitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
          Done
        </Button>
      </form>
    </Form>
  );
}

export function EditMembers() {
  const { conversation, changeCurrentConversation } = useCurrentConversation();
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

  useEffect(() => {
    if (data) {
      const allItems = [...data];
      // only add those participants which are in the conversation
      const uniqueItems = allItems.filter((person) => {
        return !conversation.participants.includes(person.id);
      });
      setFilteredMembers(uniqueItems);
    }
  }, [data]);
  console.log(filteredMembers);

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
  async function editGroup() {
    setIsSubmitting(true);
    const participants = added.map((person) => person.id);
    try {
      const res = await api.put(`/conversations/?id=${getId()}`, {
        conversationId: conversation.conversationId,
        operation: "EDIT_PARTICIPANTS",
        participants,
      });
      const data = res.data;
      console.log(data);

      const newConversation: ConversationStateType = {
        ...conversation,
        participants: res.data.participants,
      };
      changeCurrentConversation(newConversation);
    } catch (err) {
      console.log(err);
      toast("Error edit group members.");
    }
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
      <Button disabled={added.length === 0 || submitting} onClick={editGroup}>
        {submitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
        Done
      </Button>
    </div>
  );
}
