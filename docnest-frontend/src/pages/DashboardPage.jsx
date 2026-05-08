import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import {
  MdAdd, MdUpload, MdVisibility, MdEdit, MdDelete, MdAccountTree,
  MdFolder, MdPeople, MdFamilyRestroom, MdWarning, MdExpandMore,
  MdKeyboardArrowRight, MdPhone, MdLocationOn, MdAccessTime,
} from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts'
import { dashboardService } from '../services/dashboardService'
import { clientService } from '../services/clientService'
import { toast } from 'react-toastify'
import ConfirmModal from '../components/ui/ConfirmModal'
import SkeletonCard from '../components/ui/SkeletonCard'
import {
  getFullName, avatarColor, getInitials, formatDate, timeAgo,
  docTypeLabel, actionLabel, actionColor,
} from '../utils/formatters'

const DOC_COLORS = { AADHAR: '#4F46E5', PAN: '#10B981', DRIVING_LICENSE: '#F59E0B', ELECTRICITY_BILL: '#EF4444' }
const INITIAL_SHOW = 7

export default function DashboardPage() {
  const nav = useNavigate()
  const [stats, setStats] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    try {
      const [s, c] = await Promise.all([
        dashboardService.getStats(),
        clientService.getAll({ page: 0, size: 50 }),
      ])
      setStats(s.data)
      setClients(c.data?.content || c.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await clientService.delete(deleteId)
      toast.success('Client deleted')
      setDeleteId(null)
      load()
    } catch (e) { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  const chartData = stats?.documentsByType
    ? Object.entries(stats.documentsByType).map(([type, count]) => ({ name: docTypeLabel(type), count, type }))
    : []

  const visibleClients = expanded ? clients : clients.slice(0, INITIAL_SHOW)
  const hasMore = clients.length > INITIAL_SHOW

  // ── Mini stat for right sidebar ──
  const MiniStat = ({ icon, label, value, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
      <Box sx={{
        width: 34, height: 34, borderRadius: '8px',
        background: `${color}14`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.1 }}>{value ?? 0}</Typography>
      </Box>
    </Box>
  )

  // ── Client Row ──
  const ClientRow = ({ client, isLast }) => {
    const full = getFullName(client)
    const color = avatarColor(full)
    const pct = client.hasMissingDocuments ? Math.round(((client.documentCount || 0) / 4) * 100) : 100
    return (
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2,
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        transition: 'all 0.15s',
        '&:hover': { background: 'var(--surface-2)' },
      }}>
        {/* Avatar + Info */}
        <Avatar sx={{ bgcolor: color, width: 38, height: 38, fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', cursor: 'pointer' }}
          onClick={() => nav(`/clients/${client.id}`)}>{getInitials(client.firstName, client.lastName)}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => nav(`/clients/${client.id}`)}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }} noWrap>{full}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 0.3, fontSize: '0.65rem' }}>
              <MdLocationOn size={11} /> {client.locationName || '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 0.3, fontSize: '0.65rem' }}>
              <MdPhone size={11} /> {client.mobile}
            </Typography>
          </Box>
        </Box>

        {/* Doc completion */}
        <Box sx={{ width: 110, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600, color: pct === 100 ? '#059669' : '#D97706' }}>{pct}%</Typography>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{client.documentCount || 0}/4</Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct} sx={{
            height: 4, borderRadius: 2, bgcolor: 'var(--surface-3)',
            '& .MuiLinearProgress-bar': { borderRadius: 2, background: pct === 100 ? '#059669' : pct > 50 ? '#4F46E5' : '#D97706' },
          }} />
        </Box>

        {/* Status badge */}
        <Chip size="small"
          label={client.hasMissingDocuments ? 'Incomplete' : 'Complete'}
          sx={{
            height: 22, fontSize: '0.6rem', fontWeight: 600, display: { xs: 'none', sm: 'flex' },
            background: client.hasMissingDocuments ? '#FFF7ED' : '#ECFDF5',
            color: client.hasMissingDocuments ? '#D97706' : '#059669',
            border: `1px solid ${client.hasMissingDocuments ? '#FDE68A' : '#A7F3D0'}`,
          }}
        />

        {/* Family count */}
        <Tooltip title={`${client.familyMemberCount || 0} family members`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'var(--text-muted)', display: { xs: 'none', lg: 'flex' } }}>
            <MdFamilyRestroom size={14} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{client.familyMemberCount || 0}</Typography>
          </Box>
        </Tooltip>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
          <Tooltip title="View"><IconButton size="small" onClick={() => nav(`/clients/${client.id}`)} sx={{ color: 'var(--primary)', '&:hover': { background: 'var(--primary-light)' } }}><MdVisibility size={15} /></IconButton></Tooltip>
          <Tooltip title="Documents"><IconButton size="small" onClick={() => nav(`/clients/${client.id}/documents`)} sx={{ color: '#10B981', '&:hover': { background: '#ECFDF5' } }}><MdFolder size={15} /></IconButton></Tooltip>
          <Tooltip title="Family Tree"><IconButton size="small" onClick={() => nav(`/family/${client.id}`)} sx={{ color: '#8B5CF6', '&:hover': { background: '#F5F3FF' } }}><MdAccountTree size={15} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => nav(`/clients/${client.id}`)} sx={{ color: 'var(--text-muted)', '&:hover': { background: 'var(--surface-3)' } }}><MdEdit size={14} /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(client.id)} sx={{ color: '#EF4444', '&:hover': { background: '#FEF2F2' } }}><MdDelete size={14} /></IconButton></Tooltip>
        </Box>
      </Box>
    )
  }

  if (loading) return (
    <Box className="page-enter" sx={{ p: 4 }}>
      <Grid container spacing={3}>{[1,2,3,4].map(i => <Grid item xs={6} md={3} key={i}><SkeletonCard /></Grid>)}</Grid>
    </Box>
  )

  return (
    <Box className="page-enter">
      {/* ── Header ──────────────────────────────────── */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.25, fontSize: '1.6rem' }}>Operations</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Manage clients, documents, and family records.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<MdUpload size={16} />} onClick={() => nav('/import')} size="small">Import</Button>
          <Button variant="contained" startIcon={<MdAdd size={16} />} onClick={() => nav('/clients/add')} size="small">New Client</Button>
        </Box>
      </Box>

      {/* ── Two-Column Body ─────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>

        {/* ═══ LEFT: Client Operations (70%) ═══ */}
        <Box sx={{ flex: '1 1 0', minWidth: 0, width: { xs: '100%', lg: '70%' } }}>
          <Card sx={{ overflow: 'hidden' }}>
            {/* Section header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid var(--border)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 4, height: 20, background: 'var(--primary)', borderRadius: 2 }} />
                <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem' }}>Client Operations</Typography>
                <Chip label={clients.length} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, background: 'var(--primary-light)', color: 'var(--primary)' }} />
              </Box>
              <Button size="small" endIcon={<MdKeyboardArrowRight size={14} />} onClick={() => nav('/clients')} sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--accent)' }}>View All</Button>
            </Box>

            {/* Column headers */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2, px: 2.5, py: 0.75, background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', ml: 6.5 }}>Client</Typography>
              <Typography variant="caption" sx={{ width: 110, fontWeight: 600, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: { xs: 'none', md: 'block' } }}>Documents</Typography>
              <Typography variant="caption" sx={{ width: 75, fontWeight: 600, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: { xs: 'none', sm: 'block' } }}>Status</Typography>
              <Typography variant="caption" sx={{ width: 30, fontWeight: 600, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: { xs: 'none', lg: 'block' } }}>Fam</Typography>
              <Typography variant="caption" sx={{ width: 145, fontWeight: 600, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</Typography>
            </Box>

            {/* Client rows */}
            {clients.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                <MdPeople size={40} color="var(--border-strong)" />
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 1.5, fontWeight: 500 }}>No clients yet</Typography>
                <Button variant="contained" startIcon={<MdAdd />} onClick={() => nav('/clients/add')} sx={{ mt: 2 }} size="small">Create First Client</Button>
              </Box>
            ) : (
              <>
                {visibleClients.map((c, i) => <ClientRow key={c.id} client={c} isLast={i === visibleClients.length - 1 && !hasMore} />)}
                {hasMore && (
                  <Box sx={{ textAlign: 'center', py: 1.5, borderTop: '1px solid var(--border)' }}>
                    <Button size="small" endIcon={<MdExpandMore size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />}
                      onClick={() => setExpanded(e => !e)}
                      sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--primary)' }}>
                      {expanded ? 'Show Less' : `Show ${clients.length - INITIAL_SHOW} More`}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Box>

        {/* ═══ RIGHT: Analytics Sidebar (30%) ═══ */}
        <Box sx={{ width: { xs: '100%', lg: 300 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Quick Metrics */}
          <Card sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>Quick Metrics</Typography>
            <MiniStat icon={<MdPeople size={16} />} label="Total Clients" value={stats?.totalClients} color="#4F46E5" />
            <Divider sx={{ borderColor: 'var(--border)' }} />
            <MiniStat icon={<MdFamilyRestroom size={16} />} label="Family Members" value={stats?.totalFamilyMembers ?? stats?.totalFamilies} color="#8B5CF6" />
            <Divider sx={{ borderColor: 'var(--border)' }} />
            <MiniStat icon={<MdFolder size={16} />} label="Documents" value={stats?.totalDocuments} color="#10B981" />
            <Divider sx={{ borderColor: 'var(--border)' }} />
            <MiniStat icon={<MdWarning size={16} />} label="Missing Docs" value={stats?.missingDocumentClients} color="#F59E0B" />
          </Card>

          {/* Document Analytics Chart */}
          <Card sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', mb: 2 }}>Document Analytics</Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} layout="vertical" barSize={14} margin={{ left: 0, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fontWeight: 500, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <RTooltip cursor={{ fill: 'var(--surface-2)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', padding: '8px 12px', fontSize: '0.75rem' }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {chartData.map(e => <Cell key={e.type} fill={DOC_COLORS[e.type] || '#4F46E5'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>No documents uploaded yet</Typography>
              </Box>
            )}
          </Card>

          {/* Recent Activity */}
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Recent Activity</Typography>
              <Button size="small" onClick={() => nav('/activity')} sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)', p: 0, minWidth: 0 }}>View All</Button>
            </Box>
            {stats?.recentActivities?.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {stats.recentActivities.slice(0, 6).map((a, i) => (
                  <Box key={a.id || i} sx={{ display: 'flex', gap: 1.5, py: 1, borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                    <Box className="activity-dot" sx={{ background: actionColor(a.action), mt: '4px' }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.7rem', display: 'block' }}>{actionLabel(a.action)}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.6rem' }} noWrap>{a.description}</Typography>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'var(--text-muted)', fontSize: '0.55rem', mt: 0.25 }}>
                        <MdAccessTime size={10} /> {timeAgo(a.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', textAlign: 'center', py: 2 }}>No recent activity</Typography>
            )}
          </Card>

          {/* Missing Docs Alert */}
          {stats?.missingDocumentClients > 0 && (
            <Card sx={{ p: 2.5, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MdWarning size={16} color="#D97706" />
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#92400E' }}>Action Required</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#92400E', fontSize: '0.7rem', display: 'block', lineHeight: 1.5 }}>
                {stats.missingDocumentClients} client{stats.missingDocumentClients > 1 ? 's' : ''} with incomplete documents. Upload remaining documents to complete verification.
              </Typography>
              <Button size="small" onClick={() => nav('/clients')} sx={{ mt: 1, fontWeight: 600, fontSize: '0.65rem', color: '#D97706' }}>
                Review Clients →
              </Button>
            </Card>
          )}
        </Box>
      </Box>

      {/* Delete Modal */}
      <ConfirmModal open={!!deleteId} title="Delete Client" message="This will permanently delete the client and all their documents. This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </Box>
  )
}
