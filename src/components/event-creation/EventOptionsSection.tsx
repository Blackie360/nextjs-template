import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Ticket, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "./types";

interface EventOptionsSectionProps {
  form: UseFormReturn<EventFormData>;
}

export const EventOptionsSection = ({ form }: EventOptionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold">Event Options</h3>
      
      <div className="bg-white/20 p-4 rounded-lg space-y-4">
        <FormField
          control={form.control}
          name="requireApproval"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <FormLabel className="flex items-center gap-2 mb-0">
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
            <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <FormLabel className="flex items-center gap-2 mb-0">
                <Users className="h-5 w-5" />
                Capacity
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full sm:w-32 bg-transparent"
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