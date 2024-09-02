"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { predictFraud } from "@/utils/api";

// Define schema for form validation
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits"),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
  cvv: z.string().min(3, "CVV must be 3 digits").max(3, "CVV must be 3 digits"),
  amount: z.string().nonempty("Amount is required"),
});

export function PaymentForm() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
  });

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    console.log(values);

    const time = new Date();
    const formattedTime = format(time, "yyyy-MM-dd'T'HH:mm:ssXXX");

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Create transaction data object
          const transactionData = {
            transaction_amount: parseFloat(values.amount),
            transaction_location: location,
            transaction_time: formattedTime,
            device_type: "web", // Assuming device type is "web"; adjust if needed
          };

          // Process transaction data (e.g., make API call)
          submitTransactionData(transactionData);
        },
        (error) => {
          console.error("Error fetching location: ", error);

          // Create transaction data object without location
          const transactionData = {
            transaction_amount: parseFloat(values.amount),
            transaction_location: null,
            transaction_time: formattedTime,
            device_type: "web",
          };

          // Process transaction data (e.g., make API call)
          submitTransactionData(transactionData);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");

      // Create transaction data object without location
      const transactionData = {
        transaction_amount: parseFloat(values.amount),
        transaction_location: null,
        transaction_time: formattedTime,
        device_type: "web",
      };

      // Process transaction data (e.g., make API call)
      submitTransactionData(transactionData);
    }
  }

  async function submitTransactionData(data: any) {
    try {
      const result = await predictFraud(data); // Replace with your fraud detection function
      console.log("Fraud prediction result: ", result);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormDescription>
                Enter the 16-digit card number on the card.
              </FormDescription>
              <FormControl>
                <div className="w-full h-full px-3 py-5 rounded-xl border border-black/20 bg-slate-50/20">
                  <InputOTP maxLength={16} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={8} />
                      <InputOTPSlot index={9} />
                      <InputOTPSlot index={10} />
                      <InputOTPSlot index={11} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={12} />
                      <InputOTPSlot index={13} />
                      <InputOTPSlot index={14} />
                      <InputOTPSlot index={15} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cvv"
          render={({ field }) => (
            <FormItem className="flex ">
              <div className="w-1/2">
                <FormLabel>CVV</FormLabel>
                <FormDescription>
                  Enter the 3-digit number on the card.
                </FormDescription>
              </div>
              <FormControl className="w-full py-5">
                <Input
                  placeholder="324"
                  {...field}
                  className="w-1/2 h-full px-3 rounded-xl border border-black/20 text-center"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex">
              <div className="w-1/2">
                <FormLabel>Expiry Date</FormLabel>
                <FormDescription>
                  Enter the expiration date of the card.
                </FormDescription>
              </div>
              <div className="w-1/2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "text-center font-normal w-full h-full px-5 py-5 rounded-xl border border-black/20",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM/yy")
                        ) : (
                          <span className="w-full text-center">Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        const maxDate = new Date(
                          today.getFullYear() + 10,
                          11,
                          31
                        ); // Max 10 years from now
                        return date < today || date > maxDate;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex ">
              <div className="w-1/2">
                <FormLabel>Amount</FormLabel>
                <FormDescription>
                  Enter the amount to be charged.
                </FormDescription>
              </div>
              <FormControl className="w-full py-5">
                <Input
                  placeholder="1000"
                  {...field}
                  className="w-1/2 h-full px-3 rounded-xl border border-black/20 text-center"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
