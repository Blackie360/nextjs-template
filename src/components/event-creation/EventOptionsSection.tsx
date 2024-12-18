import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, Users, Video, MapPin } from "lucide-react";
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
          name="locationType"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <FormLabel className="flex items-center gap-2 mb-0">
                <MapPin className="h-5 w-5" />
                Location Type
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === 'physical') {
                      form.setValue('meetingPlatform', undefined);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px] bg-transparent">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical Location</SelectItem>
                    <SelectItem value="virtual">Virtual Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('locationType') === 'virtual' && (
          <FormField
            control={form.control}
            name="meetingPlatform"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <FormLabel className="flex items-center gap-2 mb-0">
                  <Video className="h-5 w-5" />
                  Platform
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] bg-transparent">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {form.watch('locationType') === 'physical' && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <FormLabel className="flex items-center gap-2 mb-0">
                  <MapPin className="h-5 w-5" />
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full sm:w-[200px] bg-transparent"
                    placeholder="Enter address"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {form.watch('locationType') === 'virtual' && (
          <FormField
            control={form.control}
            name="meetingLink"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <FormLabel className="flex items-center gap-2 mb-0">
                  <Video className="h-5 w-5" />
                  Meeting Link
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full sm:w-[200px] bg-transparent"
                    placeholder="Enter meeting link"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

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
                  className="w-full sm:w-[200px] bg-transparent"
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