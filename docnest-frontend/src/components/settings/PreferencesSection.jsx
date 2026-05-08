import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { MdSave } from 'react-icons/md'
import { toast } from 'react-toastify'
import { settingsService } from '../../services/settingsService'

const BOOL_KEYS = ['enable_doc_preview', 'enable_activity_logs', 'enable_notifications', 'enable_upload_compression']

export default function PreferencesSection() {
  const [prefs, setPrefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { settingsService.getPreferences().then(r => setPrefs(r.data)).catch(() => {}).finally(() => setLoading(false)) }, [])

  const update = (id, val) => setPrefs(ps => ps.map(p => p.id === id ? { ...p, prefValue: val } : p))

  const save = async () => {
    setSaving(true)
    try { await settingsService.updatePreferences(prefs); toast.success('Preferences saved') }
    catch { toast.error('Save failed') } finally { setSaving(false) }
  }

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>System Preferences</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Control application-wide behaviors.</Typography>
        </Box>
        <Button variant="contained" startIcon={<MdSave size={16}/>} onClick={save} disabled={saving} size="small">
          {saving ? <CircularProgress size={18} sx={{ color: '#fff' }}/> : 'Save'}
        </Button>
      </Box>
      <Card sx={{ overflow: 'hidden' }}>
        {prefs.map((p, i) => (
          <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, gap: 2, borderBottom: i < prefs.length - 1 ? '1px solid var(--border)' : 'none', '&:hover': { background: 'var(--surface-2)' }, transition: 'background 0.15s' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{p.description || p.prefKey}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>{p.prefKey}</Typography>
            </Box>
            {BOOL_KEYS.includes(p.prefKey) ? (
              <Switch checked={p.prefValue === 'true'} onChange={() => update(p.id, p.prefValue === 'true' ? 'false' : 'true')} size="small" />
            ) : p.prefKey === 'default_page_size' ? (
              <TextField select size="small" value={p.prefValue} onChange={e => update(p.id, e.target.value)} sx={{ width: 100 }}>
                {['5','10','20','50'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </TextField>
            ) : (
              <TextField size="small" value={p.prefValue} onChange={e => update(p.id, e.target.value)} sx={{ width: 120 }} />
            )}
          </Box>
        ))}
      </Card>
    </Box>
  )
}
