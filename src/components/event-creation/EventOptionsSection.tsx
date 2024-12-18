import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Ticket, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "./types";

interface EventOptionsSectionProps {
  form: UseFormReturn<EventFormData>;
}

export const EventOptionsSection = ({ form }: EventOptionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Event Options</h3>
      
      <div className="bg-opacity-20 bg-white p-4 rounded-lg space-y-4">
        <FormField
          control={form.control}
          name="requireApproval"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Require Approval
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxAttendees"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Capacity
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-32 bg-transparent"
                  placeholder="Unlimited"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};