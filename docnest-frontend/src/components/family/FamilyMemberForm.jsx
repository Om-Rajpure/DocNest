import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { familyService } from '../../services/familyService'

const RELATIONS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other']
const GENDERS   = ['Male', 'Female', 'Other']
const EMPTY = { memberName: '', relation: '', dob: '', gender: '', mobile: '' }

export default function FamilyMemberForm({ open, onClose, clientId, member, onSaved }) {
  const isEdit = !!member?.id
  const [form, setForm] = useState(member || EMPTY)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.memberName?.trim()) errs.memberName = 'Name is required'
    if (!form.relation)           errs.relation   = 'Relation is required'
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) errs.mobile = 'Enter valid 10-digit mobile'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { ...form, clientId, dob: form.dob || null }
      if (isEdit) await familyService.update(member.id, payload)
      else        await familyService.add(payload)
      toast.success(isEdit ? 'Member updated' : 'Member added')
      onSaved?.()
      onClose()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' } } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
        {isEdit ? 'Edit Family Member' : 'Add Family Member'}
      </DialogTitle>
      <DialogContent sx={{ pt: '16px !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Full Name *" value={form.memberName} onChange={set('memberName')}
              error={!!errors.memberName} helperText={errors.memberName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Relation *" value={form.relation} onChange={set('relation')}
              error={!!errors.relation} helperText={errors.relation}>
              {RELATIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Gender" value={form.gender} onChange={set('gender')}>
              {GENDERS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date of Birth" type="date" value={form.dob || ''} onChange={set('dob')}
              InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Mobile" value={form.mobile} onChange={set('mobile')}
              error={!!errors.mobile} helperText={errors.mobile} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : (isEdit ? 'Update' : 'Add Member')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
