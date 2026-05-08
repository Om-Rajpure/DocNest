import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { clientService } from '../services/clientService'
import { locationService } from '../services/locationService'
import { isValidMobile, isValidEmail } from '../utils/validators'
import { formatDate } from '../utils/formatters'

const STEPS = ['Personal Information', 'Review & Save']
const GENDERS = ['Male', 'Female', 'Other']
const EMPTY = { firstName: '', lastName: '', mobile: '', dob: '', gender: '', address: '', email: '', locationId: '' }

export default function AddClientPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [locations, setLocations] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    locationService.getAll().then(r => setLocations(r.data)).catch(() => {})
  }, [])

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(e => ({ ...e, [field]: undefined })) }

  const validate = () => {
    const errs = {}
    if (!form.firstName?.trim()) errs.firstName = 'First name is required'
    if (!form.lastName?.trim())  errs.lastName  = 'Last name is required'
    if (!form.mobile?.trim())    errs.mobile    = 'Mobile is required'
    else if (!isValidMobile(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.locationId)        errs.locationId = 'Location is required'
    if (form.email && !isValidEmail(form.email)) errs.email = 'Enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => { if (validate()) setStep(1) }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = {
        ...form,
        locationId: form.locationId ? Number(form.locationId) : null,
        dob: form.dob || null,
      }
      const res = await clientService.create(payload)
      toast.success('Client profile created successfully!')
      navigate(`/clients/${res.data.id}`)
    } catch (err) {
      console.error('Save client error:', err)
      toast.error(err.message || 'Unable to save client. Please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const loc = locations.find(l => l.id === Number(form.locationId))

  return (
    <Box className="page-enter" sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>Add New Client</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Create a professional profile for your new client.</Typography>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 5, '& .MuiStepLabel-label': { fontFamily: 'var(--font-body)', fontSize: '0.875rem' } }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {step === 0 && (
        <Card sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 4, height: 20, background: 'var(--primary)', borderRadius: 2 }} />
            Client Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={form.firstName} onChange={set('firstName')} error={!!errors.firstName} helperText={errors.firstName} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={form.lastName} onChange={set('lastName')} error={!!errors.lastName} helperText={errors.lastName} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" value={form.mobile} onChange={set('mobile')} error={!!errors.mobile} helperText={errors.mobile} inputProps={{ maxLength: 10 }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" type="date" value={form.dob} onChange={set('dob')} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} sm={6}><TextField select fullWidth label="Gender" value={form.gender} onChange={set('gender')}>{GENDERS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Primary Location" value={form.locationId} onChange={set('locationId')} error={!!errors.locationId} helperText={errors.locationId}>
                {locations.map(l => <MenuItem key={l.id} value={l.id}>{l.locationName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Email Address" type="email" value={form.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Full Residential Address" multiline rows={3} value={form.address} onChange={set('address')} /></Grid>
          </Grid>
        </Card>
      )}

      {step === 1 && (
        <Card sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 4, height: 20, background: 'var(--success)', borderRadius: 2 }} />
            Final Review
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Full Name', value: `${form.firstName} ${form.lastName}` },
              { label: 'Mobile', value: form.mobile },
              { label: 'Location', value: loc?.locationName || 'N/A' },
              { label: 'Email', value: form.email || 'N/A' },
              { label: 'DOB', value: form.dob ? formatDate(form.dob) : 'N/A' },
              { label: 'Gender', value: form.gender || 'N/A' },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ p: 2, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>{f.label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ p: 2, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>Full Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{form.address || 'Not provided'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={() => step === 0 ? navigate('/clients') : setStep(0)} disabled={saving}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button variant="contained" onClick={step === 0 ? handleNext : handleSave} disabled={saving} sx={{ minWidth: 160 }}>
          {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : (step === 0 ? 'Review Profile' : 'Confirm & Create')}
        </Button>
      </Box>
    </Box>
  )
}
