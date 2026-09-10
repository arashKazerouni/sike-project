import { createClient } from '@/lib/supabase/server'

export async function approveTaskReward(userId: string, amount: number, reference: string) {
  const supabase = await createClient()

  const { data: wallet } = await supabase
    .from('wallets')
    .select('sike_balance')
    .eq('user_id', userId)
    .single()

  if (!wallet) throw new Error('Wallet not found')

  const balance = Number(wallet.sike_balance || 0) + amount

  await supabase.from('wallets').update({ sike_balance: balance }).eq('user_id', userId)

  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'reward',
    amount,
    status: 'completed',
    reference,
  })

  return balance
}
