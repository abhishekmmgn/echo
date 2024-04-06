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
import { Avatar, AvatarImage } from "../ui/avatar";

const formSchema = z.object({
  avatar: z.string().optional(),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
  username: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(10, {
      message: "Username must be at most 10 characters.",
    }),
});

export default function EditProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      name: "",
      username: "",
    },
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { isSubmitting } = form.formState;
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      setInterval(() => {
        //   form.reset();
      }, 3000);
      fetch("");
      console.log(values);
    } else {
      toast("You have reached the limit of 3 submits");
    }
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      if (file.size > 1024 * 1024) {
        toast("File size must be less than 1MB.");
        return;
      }
      setAvatarUrl(URL.createObjectURL(file));
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      //upload file and seturl
      //   form.setValue("avatar", uploadUrl);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-4">
      <Avatar className="h-24 w-24 bg-secondary mx-auto">
          <AvatarImage src={avatarUrl || ""} alt="Group photo" />
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
        <FormField
          control={form.control}
          disabled={isSubmitting}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="john7seed" {...field} />
              </FormControl>
              <FormDescription>This is your user id.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting && (
            <Loader className="w-5 h-5 mr-1 animate-spin" />
          )}
          Done
        </Button>
      </form>
    </Form>
  );
}
