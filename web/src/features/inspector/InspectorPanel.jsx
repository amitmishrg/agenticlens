import TypeIcon  from '../../components/TypeIcon';
import MetaSection from './MetaSection';
import JsonViewer  from './JsonViewer';
import { getAccent } from '../../constants/typeConfig';

export default function InspectorPanel({ node }) {
  if (!node) return null;
  const ac = getAccent(node.type);

  return (
    <div
      style={{ padding: '16px 18px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 8,
            background: `${ac}22`, border: `1.5px solid ${ac}55`,
          }}
        >
          <TypeIcon type={node.type} color={ac} size={18} />
        </span>
        <div>
          <p style={{ color: '#f3f4f6', fontWeight: 600, fontSize: 14, margin: 0 }}>
            {node.label}
          </p>
          <p style={{ color: ac, fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
            {node.type}
          </p>
        </div>
      </div>

      <MetaSection meta={node.meta} timestamp={node.timestamp} />
      <JsonViewer  data={node.data} />
    </div>
  );
}
