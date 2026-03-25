import useAgentStore from '../store/useAgentStore';

const TYPE_STYLES = {
  user:            { dot: 'bg-blue-500',   badge: 'bg-blue-900 text-blue-300',    text: 'text-blue-200'    },
  assistant:       { dot: 'bg-green-500',  badge: 'bg-green-900 text-green-300',  text: 'text-green-200'   },
  thinking:        { dot: 'bg-yellow-500', badge: 'bg-yellow-900 text-yellow-300', text: 'text-yellow-200' },
  system:          { dot: 'bg-purple-500', badge: 'bg-purple-900 text-purple-300', text: 'text-purple-200' },
  result:          { dot: 'bg-gray-500',   badge: 'bg-gray-700 text-gray-300',    text: 'text-gray-300'    },
  tool_use:        { dot: 'bg-orange-500', badge: 'bg-orange-900 text-orange-300', text: 'text-orange-200' },
  tool_result:     { dot: 'bg-teal-500',   badge: 'bg-teal-900 text-teal-300',    text: 'text-teal-200'    },
  progress:        { dot: 'bg-cyan-500',   badge: 'bg-cyan-900 text-cyan-300',    text: 'text-cyan-200'    },
  'queue-operation': { dot: 'bg-pink-500', badge: 'bg-pink-900 text-pink-300',    text: 'text-pink-200'    },
  'last-prompt':   { dot: 'bg-indigo-400', badge: 'bg-indigo-900 text-indigo-300', text: 'text-indigo-200' },
  unknown:         { dot: 'bg-gray-600',   badge: 'bg-gray-700 text-gray-400',    text: 'text-gray-400'    },
};

function getStyle(type) {
  return TYPE_STYLES[type] || TYPE_STYLES.unknown;
}

export default function TreeNode({ node, depth = 0 }) {
  const { selectedNode, setSelectedNode, collapsed, toggleCollapse } = useAgentStore();
  const isSelected = selectedNode?.id === node.id;
  const hasChildren = node.children?.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const style = getStyle(node.type);

  function handleClick(e) {
    e.stopPropagation();
    setSelectedNode(node);
  }

  function handleToggle(e) {
    e.stopPropagation();
    toggleCollapse(node.id);
  }

  const indent = depth * 16;

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded mx-1 my-0.5 transition-colors group ${
          isSelected
            ? 'bg-indigo-700/40 ring-1 ring-indigo-500'
            : 'hover:bg-gray-700/50'
        }`}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        {/* Expand / collapse toggle */}
        <button
          onClick={handleToggle}
          className={`w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-300 shrink-0 transition-transform ${
            !hasChildren ? 'invisible' : ''
          }`}
        >
          <span
            className={`text-[10px] transition-transform duration-150 ${
              isCollapsed ? '' : 'rotate-90'
            }`}
          >
            ▶
          </span>
        </button>

        {/* Color dot */}
        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />

        {/* Type badge */}
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide shrink-0 ${style.badge}`}>
          {node.type}
        </span>

        {/* Label */}
        <span className={`text-xs truncate ${style.text}`}>
          {node.label}
        </span>

        {/* Child count */}
        {hasChildren && (
          <span className="ml-auto text-[10px] text-gray-600 shrink-0">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
