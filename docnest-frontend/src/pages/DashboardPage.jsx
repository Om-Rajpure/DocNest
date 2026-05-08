import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router-dom'
import { MdPeople, MdFamilyRestroom, MdFolder, MdWarning, MdArrowForward, MdUpload, MdAdd } from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../components/ui/StatCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import EmptyState from '../components/ui/EmptyState'
import { dashboardService } from '../services/dashboardService'
import { getFullName, avatarColor, getInitials, formatDate, docTypeLabel } from '../utils/formatters'

const DOC_COLORS = { AADHAR: '#4F46E5', PAN: '#10B981', DRIVING_LICENSE: '#F59E0B', ELECTRICITY_BILL: '#EF4444' }

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    dashboardService.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const chartData = stats?.documentsByType
    ? Object.entries(stats.documentsByType).map(([type, count]) => ({ name: docTypeLabel(type), count, type }))
    : []

  return (
    <Box className="page-enter">
      {/* Header */}
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>Overview</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Track your client records and document metrics.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<MdUpload />} onClick={() => navigate('/import')}>Import Excel</Button>
          <Button variant="contained" startIcon={<MdAdd />} onClick={() => navigate('/clients/add')}>Create Client</Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { title: 'Total Clients',   value: stats?.totalClients,           icon: <MdPeople size={20} />,        color: '#4F46E5', sub: 'Active profiles' },
          { title: 'Family Members',  value: stats?.totalFamilyMembers ?? stats?.totalFamilies, icon: <MdFamilyRestroom size={20} />, color: '#8B5CF6', sub: 'Linked members' },
          { title: 'Documents',       value: stats?.totalDocuments,         icon: <MdFolder size={20} />,         color: '#10B981', sub: 'Stored files' },
          { title: 'Action Needed',   value: stats?.missingDocumentClients, icon: <MdWarning size={20} />,        color: '#F59E0B', sub: 'Missing docs' },
        ].map((card, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            {loading ? <SkeletonCard /> : <StatCard {...card} />}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-heading)', mb: 3 }}>Document Distribution</Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--surface-2)' }} 
                    contentStyle={{ 
                      borderRadius: 'var(--radius)', border: 'none', 
                      boxShadow: 'var(--shadow-md)', padding: '12px 16px',
                      fontFamily: 'var(--font-body)',
                    }} 
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => <Cell key={entry.type} fill={DOC_COLORS[entry.type] || '#4F46E5'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState 
                icon="📁" 
                title="No documents yet" 
                description="Add your first client to start tracking document uploads."
                actionLabel="+ Create Client"
                onAction={() => navigate('/clients/add')}
              />
            )}
          </Card>
        </Grid>

        {/* Recent Clients */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-heading)' }}>Newest Members</Typography>
              <Button 
                size="small" 
                endIcon={<MdArrowForward />} 
                onClick={() => navigate('/clients')}
                sx={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.8rem' }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {stats?.recentClients?.length > 0 ? (
                stats.recentClients.slice(0, 5).map((client, i) => (
                  <Box key={client.id}>
                    <Box
                      onClick={() => navigate(`/clients/${client.id}`)}
                      sx={{ 
                        display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 1,
                        cursor: 'pointer', transition: 'all 0.15s', borderRadius: 'var(--radius-sm)',
                        '&:hover': { background: 'var(--surface-2)' } 
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: avatarColor(getFullName(client)), 
                        width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {getInitials(client.firstName, client.lastName)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }} noWrap>
                          {getFullName(client)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                          {client.locationName || 'Unassigned'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ 
                        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', flexShrink: 0,
                      }}>
                        {formatDate(client.createdAt)}
                      </Typography>
                    </Box>
                    {i < (stats.recentClients.slice(0, 5).length - 1) && <Divider sx={{ borderColor: 'var(--border)' }} />}
                  </Box>
                ))
              ) : (
                <EmptyState icon="👥" title="No clients yet" description="Create your first client to get started." />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
