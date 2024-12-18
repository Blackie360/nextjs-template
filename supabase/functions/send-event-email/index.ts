import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  eventId: string;
  userId: string;
  type: 'rsvp_confirmation' | 'group_rsvp';
  additionalEmails?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { eventId, userId, type, additionalEmails } = await req.json() as EmailRequest

    // Get event details
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('*, profiles(email)')
      .eq('id', eventId)
      .single()

    if (eventError) throw eventError

    // Get user details
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('email, username')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const emailContent = `
      <h1>Event Confirmation: ${event.title}</h1>
      <p>Hello ${user.username},</p>
      <p>Your RSVP for ${event.title} has been confirmed.</p>
      <p><strong>Event Details:</strong></p>
      <ul>
        <li>Date: ${new Date(event.start_time).toLocaleDateString()}</li>
        <li>Time: ${new Date(event.start_time).toLocaleTimeString()}</li>
        ${event.location ? `<li>Location: ${event.location}</li>` : ''}
        ${event.meeting_link ? `<li>Meeting Link: ${event.meeting_link}</li>` : ''}
      </ul>
      ${event.description ? `<p><strong>Description:</strong><br/>${event.description}</p>` : ''}
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Aura Events <events@resend.dev>',
        to: [user.email, ...(additionalEmails || [])],
        subject: `Event Confirmation: ${event.title}`,
        html: emailContent,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})