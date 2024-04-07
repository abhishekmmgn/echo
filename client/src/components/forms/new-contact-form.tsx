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

const formSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(10, {
      message: "Username must be at most 10 characters.",
    }),
});

export default function NewContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-4">
        <FormField
          control={form.control}
          disabled={isSubmitting}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader className="w-5 h-5 mr-1 animate-spin" />}
          Add
        </Button>
      </form>
    </Form>
  );
}
