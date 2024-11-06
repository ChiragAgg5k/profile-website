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
import * as z from "zod";

const formSchema = z.object({
  email: z.string(),
  message: z.string(),
});

export default function ContactMeForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
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
        <Button type="submit" size={`lg`}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
