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
import { GroupType } from "@/types";

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

export default function NewGroupForm({
  setStep,
  setGrpDetails,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setGrpDetails: React.Dispatch<
    React.SetStateAction<GroupType>
  >;
}) {
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
        avatar: values.avatar,
        id: ""
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
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
          Next
        </Button>
      </form>
    </Form>
  );
}
