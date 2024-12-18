import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon, MapPin, Text, Ticket, User, Upload } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  maxAttendees: number;
  requireApproval: boolean;
  isPrivate: boolean;
}

const EventCreationForm = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<EventFormData>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: new Date(),
      endTime: new Date(),
      maxAttendees: 0,
      requireApproval: false,
      isPrivate: false,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create an event",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("events").insert({
        title: data.title,
        description: data.description,
        location: data.location,
        start_time: data.startTime.toISOString(),
        end_time: data.endTime.toISOString(),
        max_attendees: data.maxAttendees || null,
        creator_id: user.id,
        is_private: data.isPrivate,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });
      
      navigate("/events");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `event-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#004953] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-opacity-20 bg-white px-4 py-2 rounded-lg">
              <span>Personal Calendar</span>
            </div>
          </div>
          <div className="bg-opacity-20 bg-white px-4 py-2 rounded-lg">
            <span>Public</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Cover Image */}
            <div className="relative h-64 bg-opacity-20 bg-white rounded-lg overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Event cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-12 w-12 mb-2" />
                    <span>Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Event Name */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Event Name"
                      className="text-4xl font-bold bg-transparent border-none focus:border-none focus:ring-0 placeholder:text-white/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
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

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="bg-opacity-20 bg-white p-4 rounded-lg">
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add Event Location"
                      className="bg-transparent border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="bg-opacity-20 bg-white p-4 rounded-lg">
                  <FormLabel className="flex items-center gap-2">
                    <Text className="h-5 w-5" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add Description"
                      className="bg-transparent border-none resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Event Options</h3>
              
              <div className="bg-opacity-20 bg-white p-4 rounded-lg space-y-4">
                {/* Require Approval */}
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

                {/* Max Attendees */}
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

            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EventCreationForm;