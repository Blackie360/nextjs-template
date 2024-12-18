import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "./types";

interface EventDateTimeSectionProps {
  form: UseFormReturn<EventFormData>;
}

export const EventDateTimeSection = ({ form }: EventDateTimeSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem className="bg-opacity-20 bg-white p-4 rounded-lg">
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
                  className="rounded-md border"
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
          <FormItem className="bg-opacity-20 bg-white p-4 rounded-lg">
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
                  className="rounded-md border"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};