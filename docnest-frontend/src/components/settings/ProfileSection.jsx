import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { MdSave, MdCameraAlt } from 'react-icons/md'
import { toast } from 'react-toastify'
import { settingsService } from '../../services/settingsService'

export default function ProfileSection() {
  const [profile, setProfile] = useState({ fullName: '', email: '', mobile: '', profileImage: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { settingsService.getProfile().then(r => setProfile(r.data)).catch(() => {}).finally(() => setLoading(false)) }, [])

  const set = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try { await settingsService.updateProfile(profile); toast.success('Profile updated') }
    catch { toast.error('Save failed') } finally { setSaving(false) }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await settingsService.uploadAvatar(file)
      toast.success('Avatar uploaded')
      setProfile(p => ({ ...p, profileImage: '/api/settings/profile/avatar/view?t=' + Date.now() }))
    } catch { toast.error('Upload failed') }
  }

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Admin Profile</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Update your account information.</Typography>
      </Box>
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, pb: 3, borderBottom: '1px solid var(--border)' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={profile.profileImage} sx={{ width: 80, height: 80, fontSize: '1.8rem', fontWeight: 700, bgcolor: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {profile.fullName?.charAt(0) || 'A'}
            </Avatar>
            <Button component="label" size="small" sx={{ position: 'absolute', bottom: -4, right: -4, minWidth: 28, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', '&:hover': { background: 'var(--primary-hover)' } }}>
              <MdCameraAlt size={14} />
              <input type="file" hidden accept="image/*" onChange={handleAvatar} />
            </Button>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>{profile.fullName || 'Admin'}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>{profile.email}</Typography>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}><TextField fullWidth label="Full Name" value={profile.fullName || ''} onChange={set('fullName')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={profile.email || ''} onChange={set('email')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile" value={profile.mobile || ''} onChange={set('mobile')} /></Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<MdSave size={16}/>} onClick={save} disabled={saving}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }}/> : 'Save Profile'}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
