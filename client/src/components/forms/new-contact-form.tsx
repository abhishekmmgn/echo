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
import api from "@/api/axios";
import getId from "@/lib/utils";
import { isAxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email(),
});

export default function NewContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.submitCount < 3) {
      try {
        const res = await api.post(`/contacts?id=${getId()}`, {
          email: values.email,
        });
        console.log(res.status);
        if (res.status === 201) {
          console.log(res.data.data);
          form.reset();
        }
        toast("Contact added successfully.");
      } catch (error) {
        if (isAxiosError(error)) {
          if (error?.response?.status! === 400) {
            toast("Email required.");
          } else if (error?.response?.status! === 404) {
            toast("User not found.");
          } else if (error?.response?.status! === 409) {
            toast("Contact already exists.");
          }
          return;
        }
        console.log(error);
        toast("Something went wrong");
      }
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@proton.me" {...field} />
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
