export interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  maxAttendees: number;
  requireApproval: boolean;
  isPrivate: boolean;
}