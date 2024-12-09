"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  message: z.string().nonempty("Message is required"),
});

export default function ContactMeForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = () => {
    const formElement = document.querySelector("form") as HTMLFormElement;
    formElement?.submit();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.handleSubmit(onSubmit)(event);

    const errors = form.formState.errors;

    if (errors.email || errors.message) {
      toast.error("You forgot something!", {
        description: `Looks like you forgot to enter a valid ${
          errors.email ? "email" : "message"
        }.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        action="https://formspree.io/f/xbljognz"
        method="POST"
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-y-2 items-start">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example-email@gmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-y-2 items-start">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Hi! I really like your work and want to discuss some things...."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ask me anything you would like. I always respond :D
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">
          Submit
        </Button>
      </form>
    </Form>
  );
}
