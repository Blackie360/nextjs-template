import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { eventId, message, emails } = await req.json()

    // Get all attendees for the event
    const { data: rsvps, error: rsvpError } = await supabaseClient
      .from('event_rsvps')
      .select('user_id')
      .eq('event_id', eventId)
      .eq('status', 'attending')

    if (rsvpError) throw rsvpError

    // Create notifications for each attendee
    const notifications = rsvps.map(rsvp => ({
      user_id: rsvp.user_id,
      type: 'event_message',
      message: message,
      read: false
    }))

    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert(notifications)

    if (notificationError) throw notificationError

    // Send emails if RESEND_API_KEY is configured
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_API_KEY && emails?.length > 0) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Event Organizer <onboarding@resend.dev>',
          to: emails,
          subject: 'Event Update',
          html: message,
        }),
      })

      if (!emailResponse.ok) {
        console.error('Error sending email:', await emailResponse.text())
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in send-bulk-message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})