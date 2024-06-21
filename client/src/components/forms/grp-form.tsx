import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { storage } from "@/lib/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

export default function GroupForm({
  setStep,
  setGrpDetails,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setGrpDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      avatar: string | null;
    }>
  >;
}) {
  const [fileUploading, setFileUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      setGrpDetails({
        name: values.name,
        avatar: avatarUrl || null,
      });
      form.reset();
      setStep(2);
    } else {
      toast(
        "You have reached the maximum number of attempts. Please try again later."
      );
    }
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast("File size must be less than 1MB.");
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
          Next
        </Button>
      </form>
    </Form>
  );
}
