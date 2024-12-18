export interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  maxAttendees: number;
  requireApproval: boolean;
  isPrivate: boolean;
  locationType: 'physical' | 'virtual';
  meetingPlatform?: 'zoom' | 'meet' | 'teams' | 'other';
  meetingLink?: string;
}