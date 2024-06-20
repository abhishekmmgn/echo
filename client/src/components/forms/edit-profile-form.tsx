import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import api from "@/api/axios";
import { useCurrentUser } from "@/store";
import { BasicDetailsType } from "@/types";
import { getId } from "@/lib/utils";
import { storage } from "@/lib/firebase-config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const formSchema = z.object({
  avatar: z.string().optional(),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    })
    .optional(),
});

export default function EditProfileForm() {
  const { uid, email, name, avatar, changeCurrentUser } = useCurrentUser();
  const [avatarUrl, setAvatarUrl] = useState(avatar);
  const [fileUploading, setFileUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      const res = await api.put(`/current_user?id=${getId()}`, {
        name: values.name,
        avatar: avatarUrl || null,
      });
      console.log(res.data.data);
      const data: BasicDetailsType = res.data.data;
      if (res.status === 200) {
        toast("Profile updated successfully.");
        changeCurrentUser(uid, data.name, data.avatar, email);
        console.log(values, " -> ", name, avatar);
        form.reset();
      } else {
        toast("Something went wrong");
      }
    } else {
      toast("You have reached the limit of 3 submits");
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
        "avatars/" + `${file.name}-${Date.now()}`
      );
      uploadBytes(avatarsRef, file).then((snapshot) => {
        console.log("Image uploaded!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setAvatarUrl(downloadURL);
          setFileUploading(false);
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
        });
        toast("Image uploaded!");
      });
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
          <AvatarImage src={avatarUrl || ""} alt="Your photo" />
        </Avatar>
        <FormField
          control={form.control}
          disabled={isSubmitting}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Appleseed" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            (avatarUrl === avatar && form.getValues("name") === name) ||
            isSubmitting ||
            fileUploading
          }
          className="mt-2"
        >
          {isSubmitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
          Done
        </Button>
      </form>
    </Form>
  );
}
