import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xvvxvwqlkejwcsqdqjzv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dnh2d3Fsa2Vqd2NzcWRxanp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDU0MjIsImV4cCI6MjA2MzY4MTQyMn0.aa5VPi4pzBhDW2FvDIrBWaliAN6OvfvVttV6nMtpPgk'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 