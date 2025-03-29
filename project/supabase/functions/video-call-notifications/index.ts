import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check upcoming appointments
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        doctor_id,
        slots (
          date,
          start_time
        )
      `)
      .eq('status', 'scheduled')
      .eq('type', 'video');

    if (error) throw error;

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

    for (const appointment of appointments) {
      const appointmentTime = new Date(
        `${appointment.slots.date} ${appointment.slots.start_time}`
      );

      // Check if appointment is within 30 minutes
      if (
        appointmentTime > now &&
        appointmentTime <= thirtyMinutesFromNow
      ) {
        // Send notification to patient
        await supabase.from('notifications').insert({
          user_id: appointment.patient_id,
          title: 'Upcoming Video Consultation',
          message: `Your video consultation is starting in 30 minutes. Please be ready.`,
          type: 'video_call',
          appointment_id: appointment.id
        });

        // Send notification to doctor
        await supabase.from('notifications').insert({
          user_id: appointment.doctor_id,
          title: 'Upcoming Video Consultation',
          message: `You have a video consultation starting in 30 minutes.`,
          type: 'video_call',
          appointment_id: appointment.id
        });
      }

      // Check if appointment is starting now
      if (
        appointmentTime.getTime() >= now.getTime() &&
        appointmentTime.getTime() <= now.getTime() + 60000
      ) {
        // Send notification with meeting link
        await supabase.from('notifications').insert([
          {
            user_id: appointment.patient_id,
            title: 'Video Consultation Starting',
            message: `Your video consultation is starting now. Click here to join.`,
            type: 'video_call_start',
            appointment_id: appointment.id
          },
          {
            user_id: appointment.doctor_id,
            title: 'Video Consultation Starting',
            message: `Your video consultation is starting now. Click here to join.`,
            type: 'video_call_start',
            appointment_id: appointment.id
          },
        ]);

        // Update appointment status
        await supabase
          .from('appointments')
          .update({ status: 'in_progress' })
          .eq('id', appointment.id);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});