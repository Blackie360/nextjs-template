import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MapPin, Text, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EventCoverUpload } from "./event-creation/EventCoverUpload";
import { EventDateTimeSection } from "./event-creation/EventDateTimeSection";
import { EventOptionsSection } from "./event-creation/EventOptionsSection";
import { EventFormData } from "./event-creation/types";

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

  return (
    <div className="min-h-screen bg-[#004953] text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
              <span>Personal Calendar</span>
            </button>
          </div>
          <button className="w-full sm:w-auto bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
            <Globe className="h-4 w-4" />
            <span>Public</span>
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EventCoverUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Event Name"
                      className="text-2xl md:text-4xl font-bold bg-transparent border-none focus:border-none focus:ring-0 placeholder:text-white/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <EventDateTimeSection form={form} />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="bg-white/20 p-4 rounded-lg">
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Add Event Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Offline location or virtual link"
                      className="bg-transparent border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="bg-white/20 p-4 rounded-lg">
                  <FormLabel className="flex items-center gap-2">
                    <Text className="h-5 w-5" />
                    Add Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this event about?"
                      className="bg-transparent border-none resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <EventOptionsSection form={form} />

            <Button type="submit" className="w-full bg-white/20 hover:bg-white/30">
              Create Event
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EventCreationForm;