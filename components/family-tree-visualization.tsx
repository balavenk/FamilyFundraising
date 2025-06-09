"use client"

import React, { useCallback, useState } from "react"
import Tree from "react-d3-tree"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Heart } from "lucide-react"

interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  deathDate: string
  relationship: string
  gender: string
  location: string
  phone: string
  email: string
  notes: string
  parentId: string
  spouseId: string
  donationAmount: number
}

interface TreeNode {
  name: string
  id: string
  attributes?: Record<string, string | number>
  children?: TreeNode[]
  nodeSvgShape?: {
    shape: string
    shapeProps: Record<string, any>
  }
}

interface FamilyTreeVisualizationProps {
  familyMembers: FamilyMember[]
  onMemberClick: (member: FamilyMember) => void
}

export function FamilyTreeVisualization({ familyMembers, onMemberClick }: FamilyTreeVisualizationProps) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
      setTranslate({ x: width / 2, y: height / 6 })
    }
  }, [])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const buildTreeData = useCallback(() => {
    // Create a map of all members for quick lookup
    const membersMap = new Map<string, FamilyMember>()
    familyMembers.forEach((member) => {
      membersMap.set(member.id, member)
    })

    // Find root nodes (members without parents)
    const rootMembers = familyMembers.filter((member) => !member.parentId)

    // Track processed members to avoid duplicates
    const processedIds = new Set<string>()

    // Function to build the tree recursively
    const buildNode = (member: FamilyMember): TreeNode => {
      processedIds.add(member.id)

      // Check if this member has a spouse
      const spouse = member.spouseId ? membersMap.get(member.spouseId) : null
      if (spouse) processedIds.add(spouse.id)

      // Find children of this member
      const children = familyMembers
        .filter((m) => m.parentId === member.id && !processedIds.has(m.id))
        .map((child) => buildNode(child))

      // Create node data
      const nodeData: TreeNode = {
        name: spouse
          ? `${member.firstName} & ${spouse.firstName} ${member.lastName}`
          : `${member.firstName} ${member.lastName}`,
        id: member.id,
        attributes: {
          gender: member.gender,
          birthDate: member.birthDate ? new Date(member.birthDate).toLocaleDateString() : "Unknown",
          location: member.location || "Unknown",
          donations: `$${(member.donationAmount || 0) + (spouse?.donationAmount || 0)}`,
          relationship: member.relationship || "Unknown",
        },
        nodeSvgShape: {
          shape: "rect",
          shapeProps: {
            width: 220,
            height: spouse ? 100 : 80,
            x: -110,
            y: -40,
            fill: spouse
              ? "url(#coupleGradient)"
              : member.gender === "Male"
                ? "#e6f0ff"
                : member.gender === "Female"
                  ? "#ffebf0"
                  : "#f0f0f0",
            stroke: spouse
              ? "#9333ea"
              : member.gender === "Male"
                ? "#3b82f6"
                : member.gender === "Female"
                  ? "#ec4899"
                  : "#9ca3af",
            strokeWidth: 2,
            rx: 8,
            ry: 8,
          },
        },
        children: children.length > 0 ? children : undefined,
      }

      return nodeData
    }

    // Build tree starting from root members
    const treeData: TreeNode[] = []
    rootMembers.forEach((rootMember) => {
      if (!processedIds.has(rootMember.id)) {
        treeData.push(buildNode(rootMember))
      }
    })

    return treeData.length > 0 ? treeData[0] : { name: "No family members", id: "none" }
  }, [familyMembers])

  const handleNodeClick = (nodeData: any) => {
    const member = familyMembers.find((m) => m.id === nodeData.data.id)
    if (member) {
      onMemberClick(member)
    }
  }

  const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }: any) => (
    <g onClick={() => handleNodeClick(nodeDatum)}>
      <foreignObject {...foreignObjectProps}>
        <div
          style={{
            border: "none",
            borderRadius: "8px",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "4px",
            }}
          >
            {nodeDatum.name.includes("&") && <Heart className="h-3 w-3 text-red-500 mr-1" />}
            <span
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nodeDatum.name}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "4px",
              fontSize: "10px",
            }}
          >
            <Badge variant="outline" className="text-xs">
              {nodeDatum.attributes?.relationship}
            </Badge>

            {nodeDatum.attributes?.donations && Number(nodeDatum.attributes.donations.replace("$", "")) > 0 && (
              <Badge variant="outline" className="text-xs text-green-600">
                <DollarSign className="h-3 w-3 mr-1" />
                {nodeDatum.attributes.donations}
              </Badge>
            )}
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "#666",
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            {nodeDatum.attributes?.location}
          </div>
        </div>
      </foreignObject>
    </g>
  )

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
      {dimensions.width > 0 && (
        <>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="coupleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e6f0ff" />
                <stop offset="50%" stopColor="#e6f0ff" />
                <stop offset="50%" stopColor="#ffebf0" />
                <stop offset="100%" stopColor="#ffebf0" />
              </linearGradient>
            </defs>
          </svg>
          <Tree
            data={buildTreeData()}
            translate={translate}
            orientation="vertical"
            pathFunc="step"
            collapsible={false}
            zoomable={true}
            draggable={true}
            nodeSize={{ x: 240, y: 120 }}
            separation={{ siblings: 1, nonSiblings: 1.2 }}
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({
                ...rd3tProps,
                foreignObjectProps: {
                  width: 220,
                  height: rd3tProps.nodeDatum.name.includes("&") ? 100 : 80,
                  x: -110,
                  y: -40,
                },
              })
            }
          />
        </>
      )}
    </div>
  )
}
