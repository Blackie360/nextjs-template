import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar as CalendarIcon, Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "./types";

interface EventDateTimeSectionProps {
  form: UseFormReturn<EventFormData>;
}

export const EventDateTimeSection = ({ form }: EventDateTimeSectionProps) => {
  return (
    <div className="bg-white/20 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Start
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border bg-white/10"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                End
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border bg-white/10"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-end">
        <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>GMT+03:00 Nairobi</span>
        </div>
      </div>
    </div>
  );
};