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
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

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
});

export default function EditProfileForm() {
  const { user } = useAuth0();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      name: user?.name || "",
    },
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.picture || "");

  const { isSubmitting } = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      setInterval(() => {
        //   form.reset();
      }, 3000);
      const res = await axios.put("/current_user", {
        name: form.getValues("name"),
        avatar: form.getValues("avatar"),
      });
      if(res.status === 200) {
        toast("Profile updated successfully.")
      } else {
        toast("Something went wrong")
      }
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
      //upload file and seturl to aws s3 bucket
      //   form.setValue("avatar", uploadUrl);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-4">
        <Avatar className="h-24 w-24 bg-secondary mx-auto">
          <AvatarImage src={avatarUrl} alt="Group photo" />
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
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
          Done
        </Button>
      </form>
    </Form>
  );
}
