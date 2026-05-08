import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import ActivityItem from '../components/activity/ActivityItem'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { activityService } from '../services/activityService'

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    activityService.getAll()
      .then(r => setActivities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box className="page-enter">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>Activity Logs</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>A complete audit trail of all system actions.</Typography>
      </Box>

      {loading ? (
        <Spinner message="Loading activity logs…" />
      ) : activities.length === 0 ? (
        <EmptyState 
          icon="📋" 
          title="No activity yet" 
          description="Actions like adding clients, uploading documents, and managing family members will appear here." 
        />
      ) : (
        <Card sx={{ p: 3 }}>
          {activities.map((log, i) => (
            <ActivityItem key={log.id} log={log} isLast={i === activities.length - 1} />
          ))}
        </Card>
      )}
    </Box>
  )
}
