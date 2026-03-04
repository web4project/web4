import { createClient } from '@supabase/supabase-js';
import { exportVault, importVault } from './vault';

export async function syncWithSupabase(url: string, key: string, onProgress?: (msg: string) => void) {
    if (!url || !key) throw new Error('Supabase credentials missing.');
    const supabase = createClient(url, key);

    onProgress?.('Checking cloud for existing backup...');

    onProgress?.('Checking cloud for existing backup...');
    // Assume a table 'vault_sync' with 'id'='backup' and 'data'=jsonb
    const { data: remoteRow, error: fetchErr } = await supabase
        .from('vault_sync')
        .select('data')
        .eq('id', 'backup')
        .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw new Error('Failed to reach Supabase: ' + fetchErr.message);
    }

    if (remoteRow) {
        onProgress?.('Remote backup found. Merging with local vault...');
        const remoteData = remoteRow.data;
        try {
            await importVault(remoteData, false);
            onProgress?.('Merge complete. Re-exporting merged vault...');
        } catch {
            onProgress?.('Could not merge remote data. Proceeding to push local state...');
        }
    }

    onProgress?.('Pushing merged vault to cloud...');
    const mergedData = await exportVault();
    const { error: upsertErr } = await supabase.from('vault_sync').upsert({
        id: 'backup',
        data: mergedData,
        updated_at: new Date().toISOString()
    });

    if (upsertErr) {
        throw new Error('Failed to push to cloud: ' + upsertErr.message);
    }

    onProgress?.('Sync complete!');
}
