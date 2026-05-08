import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import { MdCloudUpload, MdDownload } from 'react-icons/md'
import DropzoneUpload from '../components/document/DropzoneUpload'
import EmptyState from '../components/ui/EmptyState'
import { importService } from '../services/importService'
import { toast } from 'react-toastify'

export default function ImportPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)

  const handleFileSelected = (f) => setFile(f)

  const handleImport = async () => {
    if (!file) { toast.error('Please select an Excel file'); return }
    setLoading(true)
    try {
      const r = await importService.importExcel(file)
      setResult(r.data)
      toast.success(`${r.data.imported} clients imported successfully`)
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  const handleDownloadTemplate = async () => {
    try {
      const r = await importService.downloadTemplate()
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'client_import_template.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Template downloaded')
    } catch (e) { toast.error('Failed to download template') }
  }

  return (
    <Box className="page-enter">
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>Bulk Import</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Import your client records instantly via Excel.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<MdDownload />} onClick={handleDownloadTemplate}>
          Download Template
        </Button>
      </Box>

      {/* Upload Area */}
      <Card sx={{ mb: 5, p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 20, background: 'var(--primary)', borderRadius: 2 }} />
          Select Data Source
        </Typography>
        <DropzoneUpload onFileSelected={handleFileSelected} uploading={loading} progress={loading ? 60 : 0} />
        {file && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" startIcon={<MdCloudUpload />} onClick={handleImport}>
              Begin Import
            </Button>
          </Box>
        )}
      </Card>

      {/* Results */}
      {result && !loading && (
        <Box className="page-enter">
          {/* Summary */}
          <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Rows', value: result.totalRows, bg: 'var(--primary-light)', color: 'var(--primary)' },
              { label: 'Imported',   value: result.imported,  bg: '#ECFDF5', color: 'var(--success)' },
              { label: 'Failed',     value: result.failed,    bg: '#FEF2F2', color: 'var(--danger)' },
            ].map((stat, i) => (
              <Box key={i} sx={{ flex: 1, minWidth: 120, p: 3, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>{stat.label}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '2rem', color: stat.color, fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>{stat.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Success Rows */}
          {result.successRows?.length > 0 && (
            <Card sx={{ mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>Successfully Imported</Typography>
                <Chip label={`${result.successRows.length} rows`} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', background: '#ECFDF5', color: '#065F46' }} />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'var(--surface-3)' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Mobile</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.successRows.map((row, i) => (
                      <TableRow key={i} sx={{ '&:nth-of-type(even)': { background: 'var(--surface-2)' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.firstName} {row.lastName}</TableCell>
                        <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{row.mobile}</TableCell>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>{row.location || '—'}</TableCell>
                        <TableCell align="right">
                          <Chip label="Created" size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', background: '#ECFDF5', color: '#065F46' }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {/* Error Rows */}
          {result.errorRows?.length > 0 && (
            <Card sx={{ border: '1px solid #FECACA' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FEF2F2' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--danger)', fontFamily: 'var(--font-heading)' }}>Failed Rows</Typography>
                <Chip label={`${result.errorRows.length} errors`} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', background: '#FEE2E2', color: '#991B1B' }} />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: '#FEF2F2' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Identity</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Issues</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.errorRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.firstName || '—'} {row.lastName || '—'}</Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{row.mobile || 'No mobile'}</Typography>
                        </TableCell>
                        <TableCell>
                          {row.errors?.map((err, j) => (
                            <Chip key={j} label={err} size="small" sx={{ mr: 0.5, mb: 0.5, fontWeight: 600, fontSize: '0.65rem', background: '#FEE2E2', color: '#991B1B' }} />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      )}

      {!result && !loading && (
        <EmptyState 
          icon="📊" 
          title="Ready for Bulk Upload" 
          description="Upload your Excel file above. Make sure to follow the template format for smooth processing." 
        />
      )}
    </Box>
  )
}
