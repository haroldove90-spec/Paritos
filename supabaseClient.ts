import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dizukdfeomlslbfglsab.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpenVrZGZlb21sc2xiZmdsc2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzIxNTIsImV4cCI6MjA3ODk0ODE1Mn0.8vzUOBC07UG8DQRlVqV8csHnCo3bGbVKwbdVAWpWSZc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
