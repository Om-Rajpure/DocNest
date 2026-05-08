import { useRef, useCallback } from 'react'
import Tree from 'react-d3-tree'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

function CustomNode({ nodeDatum, toggleNode }) {
  const isRoot = nodeDatum.attributes?.relation === 'Head'
  const initials = nodeDatum.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <g>
      <foreignObject width={180} height={110} x={-90} y={-55}>
        <div className={`tree-node-card${isRoot ? ' root' : ''}`} onClick={toggleNode}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="tree-node-avatar">{initials}</div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 2, color: isRoot ? '#fff' : '#0F172A' }}>{nodeDatum.name}</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isRoot ? 'rgba(255,255,255,0.75)' : '#4F46E5', background: isRoot ? 'rgba(255,255,255,0.15)' : '#EDE9FE', borderRadius: 20, padding: '1px 8px' }}>
            {nodeDatum.attributes?.relation || 'Member'}
          </div>
          {nodeDatum.attributes?.mobile && (
            <div style={{ fontSize: '0.65rem', color: isRoot ? 'rgba(255,255,255,0.6)' : '#94A3B8', marginTop: 3 }}>
              {nodeDatum.attributes.mobile}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

export default function FamilyTreeView({ treeData }) {
  const containerRef = useRef(null)

  const translate = { x: typeof window !== 'undefined' ? window.innerWidth / 2 - 130 : 400, y: 80 }

  if (!treeData) return (
    <Box sx={{ textAlign: 'center', py: 8, color: '#94A3B8' }}>
      <Typography>No family data available</Typography>
    </Box>
  )

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: 520, background: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <Tree
        data={treeData}
        translate={translate}
        nodeSize={{ x: 220, y: 140 }}
        separation={{ siblings: 1.1, nonSiblings: 1.3 }}
        renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} />}
        orientation="vertical"
        pathFunc="step"
        pathClassFunc={() => 'tree-link'}
        zoom={0.85}
        enableLegacyTransitions
        transitionDuration={400}
      />
      <style>{`
        .tree-link { stroke: #C7D2FE !important; stroke-width: 2px !important; fill: none !important; }
      `}</style>
    </Box>
  )
}
