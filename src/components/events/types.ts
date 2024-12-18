export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  location: string | null;
  max_attendees: number | null;
  creator_id: string;
  is_private: boolean;
  event_status: string;
  event_type: string;
  event_rsvps?: Array<{ status: string; user_id: string }>;
}

export interface EventsTabProps {
  events: Event[];
  onRSVP: (eventId: string) => void;
  onChat: (eventId: string) => void;
}