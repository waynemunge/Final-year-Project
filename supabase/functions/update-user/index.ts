import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user: requestingUser }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !requestingUser) {
      throw new Error('Unauthorized')
    }

    // Check if requesting user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id)
      .eq('role', 'admin')
      .single()

    if (roleError || !roleData) {
      throw new Error('Only admins can update users')
    }

    const { userId, email, password } = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!email && !password) {
      throw new Error('At least email or password must be provided')
    }

    // Build update payload
    const updatePayload: Record<string, string> = {}
    if (email) updatePayload.email = email
    if (password) updatePayload.password = password

    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updatePayload
    )

    if (updateError) {
      throw updateError
    }

    // If email changed, also update the profiles table
    if (email) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ email })
        .eq('id', userId)

      if (profileError) {
        console.error('Failed to update profile email:', profileError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, user: updatedUser.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
