
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmiotfnuaixykzyncpcr.supabase.co'
const supabaseKey = 'sb_publishable_0kS4OMfuuJ3_5STRFsvHEg_s16DjfIf'

export const supabase = createClient(supabaseUrl, supabaseKey)
