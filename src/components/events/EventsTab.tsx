import { EventCard } from "./EventCard";
import { EventsTabProps } from "./types";

export const EventsTab = ({ events, onRSVP, onChat }: EventsTabProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRSVP={onRSVP}
          onChat={onChat}
        />
      ))}
    </div>
  );
};