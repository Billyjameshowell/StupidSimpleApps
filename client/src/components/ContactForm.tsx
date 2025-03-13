import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
import { Textarea } from "@/components/ui/textarea";
import { CALENDLY_URL } from "@/constants"; // Import CALENDLY_URL constant


// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Create mutation for form submission
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll be in touch with you shortly.",
        duration: 5000,
      });
      form.reset();
      setSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
      setSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        form.reset();
        toast({
          title: "Message sent!",
          description: "We'll be in touch soon.",
        });

        // Redirect to Calendly after a brief delay
        setTimeout(() => {
          window.open(CALENDLY_URL, "_blank"); // Use CALENDLY_URL constant
        }, 1500);
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-primary-700">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-primary-700">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="you@company.com"
                  type="email"
                  className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-primary-700">
                Tell us about your app needs
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What problem are you trying to solve?"
                  rows={4}
                  className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ea5e9]"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Schedule Free Consultation"}
        </Button>

        <div className="text-center mt-4">
          <span className="text-primary-600">or</span>
          <a
            href={CALENDLY_URL} // Use CALENDLY_URL constant
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-[#0ea5e9] font-medium hover:text-[#0284c7] transition"
          >
            Schedule directly via Calendly
          </a>
        </div>
      </form>
    </Form>
  );
}