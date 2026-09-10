import { createClient } from '@/lib/supabase/server'

export async function getActiveTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tasks').select('*').eq('active', true)
  if (error) throw error
  return data
}

export async function submitTaskCompletion(userId: string, taskId: string, proofData?: unknown) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('task_completions').insert({
    user_id: userId,
    task_id: taskId,
    proof_data: proofData ?? null,
    status: 'pending',
  }).select().single()

  if (error) throw error
  return data
}
