import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar as CalendarIcon, Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EventDateTimeSectionProps {
  form: UseFormReturn<EventFormData>;
}

export const EventDateTimeSection = ({ form }: EventDateTimeSectionProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="bg-white/20 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Start
              </FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-transparent border-none hover:bg-white/10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      // Set end time to same date if it's not set or is before start time
                      const currentEndTime = form.getValues("endTime");
                      if (!currentEndTime || currentEndTime < date) {
                        form.setValue("endTime", date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                className="mt-2 bg-transparent border-none"
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(field.value);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  field.onChange(newDate);
                }}
                defaultValue={format(field.value, "HH:mm")}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                End
              </FormLabel>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal bg-transparent border-none hover:bg-white/10",
                  !field.value && "text-muted-foreground"
                )}
                onClick={() => setIsCalendarOpen(true)}
              >
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
              </Button>
              <Input
                type="time"
                className="mt-2 bg-transparent border-none"
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(field.value);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  field.onChange(newDate);
                }}
                defaultValue={format(field.value, "HH:mm")}
              />
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-end">
        <div className="w-full sm:w-auto bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
          <Globe className="h-4 w-4" />
          <span>GMT+03:00 Nairobi</span>
        </div>
      </div>
    </div>
  );
};