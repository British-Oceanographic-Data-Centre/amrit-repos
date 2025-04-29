import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

const BASE_PATH = '/meta';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 274;
const baseNodeHeight = 60;
const fieldHeight = 20;
const definitionHeight = 90; // Height for definitions

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const numberOfFields = (node.data?.fields?.length || 0);
    const hasDefinition = node.data?.definition ? 1 : 0;
    const dynamicHeight = baseNodeHeight + numberOfFields * fieldHeight + hasDefinition * definitionHeight;
    dagreGraph.setNode(node.id, { width: nodeWidth, height: dynamicHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const hasDefinition = node.data?.definition ? 1 : 0;

    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - (baseNodeHeight + (node.data?.fields?.length || 0) * fieldHeight + hasDefinition * definitionHeight) / 2,
    };
  });

  return { nodes, edges };
};

export default function DynamicMCD({ darkMode }: { darkMode: boolean }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [directConnections, setDirectConnections] = useState<string[]>([]);
  const [secondDegreeConnections, setSecondDegreeConnections] = useState<string[]>([]);

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);

    const directlyConnectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
    const directlyConnectedNodes = directlyConnectedEdges.flatMap(edge => [edge.source, edge.target]).filter(id => id !== node.id);

    const secondDegreeEdges = edges.filter(edge =>
      directlyConnectedNodes.includes(edge.source) || directlyConnectedNodes.includes(edge.target)
    );
    const secondDegreeNodes = secondDegreeEdges
      .flatMap(edge => [edge.source, edge.target])
      .filter(id => id !== node.id && !directlyConnectedNodes.includes(id));

    setDirectConnections(directlyConnectedNodes);
    setSecondDegreeConnections([...new Set(secondDegreeNodes)]);
  }, [edges]);

  useEffect(() => {
	fetch(`${BASE_PATH}/data/mcd.json`)
	  .then((response) => response.json())
	  .then((schema) => {
		const nodes = schema.classes.map((cls: { id: string; label: string; definition?: string; fields: { code: string; title: string; type?: string }[] }) => {
		  const isSelected = selectedNodeId === cls.id;
		  const isDirect = directConnections.includes(cls.id);
		  const isSecondDegree = secondDegreeConnections.includes(cls.id);
  
		  return {
			id: cls.id,
			data: {
			  label: (
				<div style={{ padding: '6px', fontSize: '14px', paddingRight: '3px' }}>
				  <strong>{cls.label} ({cls.id})</strong>
				  {cls.definition && (
					<div style={{ fontSize: '11px', fontStyle: 'italic', color: darkMode ? '#ccc' : '#555' }}>
					  {cls.definition}
					</div>
				  )}
				  <ul style={{ paddingLeft: '18px', margin: 0, paddingTop: '6px', paddingRight: '0px' }}>
					{cls.fields.map((field, index) => (
					  <li key={index} style={{ fontSize: '11px', fontFamily: 'Consolas, Courier New, monospace', textAlign: 'left' }}>
						{`${field.code}: ${field.title} `}
						{field.type && (
						  <span style={{ color: '#7d12ff', fontFamily: 'Arial', fontStyle: 'italic', fontWeight: 'bold', fontSize: '9px' }}>
							{field.type}
						  </span>
						)}
					  </li>
					))}
				  </ul>
				</div>
			  ),
			  fields: cls.fields,
			  definition: cls.definition,
			},
			position: { x: 0, y: 0 },
			style: {
			  border: isSelected ? '3px solid #9c27b0' : isDirect ? '2px solid #9c27b0' : isSecondDegree ? '2px solid #ff4081' : '1px solid #007BFF',
			  borderRadius: '8px',
			  padding: '10px',
			  backgroundColor: darkMode
				? isSelected
				  ? '#6a1b9a'
				  : isDirect
				  ? '#7b1fa2'
				  : isSecondDegree
				  ? '#1e1e2f'
				  : '#252526'
				: isSelected
				? '#e1bee7'
				: isDirect
				? '#d1c4e9'
				: isSecondDegree
				? '#f3e5f5'
				: '#ffffff',
			  color: darkMode ? '#fff' : '#000',
			  minWidth: nodeWidth,
			  transition: '0.3s',
			},
		  };
		});
  
		const edges = schema.relationships.map((rel: { source: string; target: string }) => {
		  const isDirectConnection = selectedNodeId && (rel.source === selectedNodeId || rel.target === selectedNodeId);
		  const isIndirectConnection =
			directConnections.includes(rel.source) || directConnections.includes(rel.target);
  
		  return {
			id: `${rel.source}-${rel.target}`,
			source: rel.source,
			target: rel.target,
			animated: true,
			style: {
			  stroke: isDirectConnection ? '#9c27b0' : isIndirectConnection ? '#ff4081' : darkMode ? '#aaa' : '#444',
			  strokeWidth: isDirectConnection ? 3 : isIndirectConnection ? 2 : 1.5,
			  transition: '0.3s',
			},
		  };
		});
  
		const layouted = getLayoutedElements(nodes, edges);
		setNodes(layouted.nodes);
		setEdges(layouted.edges);
	  })
	  .catch((error) => console.error('Error loading MCD schema:', error));
  }, [selectedNodeId, directConnections, secondDegreeConnections, darkMode]); // <-- Add darkMode here
  

  return (
    <div style={{ width: '100%', height: '90vh', backgroundColor: darkMode ? '#121212' : '#f5f5f5' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={handleNodeClick}
      >
        <Background gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
} 
