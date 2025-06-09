"use client"

import type React from "react"
import { ChevronDown, ChevronRight, Users, Crown, Phone, Mail, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

interface CorporateHierarchyProps {
  familyMembers: FamilyMember[]
  onEdit: (member: FamilyMember) => void
  onDelete: (id: string) => void
  onAddChild: (parent: FamilyMember) => void
  onAddSpouse: (person: FamilyMember) => void
  expandedNodes: Set<string>
  onToggleExpanded: (nodeId: string) => void
}

export function CorporateHierarchy({
  familyMembers,
  onEdit,
  onDelete,
  onAddChild,
  onAddSpouse,
  expandedNodes,
  onToggleExpanded,
}: CorporateHierarchyProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getChildren = (parentId: string) => {
    return familyMembers.filter((member) => member.parentId === parentId)
  }

  const getHierarchyLevel = (member: FamilyMember): number => {
    if (!member.relationship) return 3

    const levelMap: Record<string, number> = {
      Grandparent: 1,
      Parent: 2,
      Self: 3,
      Spouse: 3,
      Sibling: 3,
      "Aunt/Uncle": 3,
      Child: 4,
      Cousin: 4,
      Grandchild: 5,
      Other: 4,
    }
    return levelMap[member.relationship] || 3
  }

  const getStatusColor = (member: FamilyMember) => {
    const level = getHierarchyLevel(member)
    if (level <= 2) return "bg-purple-100 border-purple-300 text-purple-800"
    if (level === 3) return "bg-blue-100 border-blue-300 text-blue-800"
    if (level === 4) return "bg-green-100 border-green-300 text-green-800"
    return "bg-gray-100 border-gray-300 text-gray-800"
  }

  const CorporateNode: React.FC<{ member: FamilyMember; level: number; isSpouse?: boolean }> = ({
    member,
    level,
    isSpouse = false,
  }) => {
    const children = getChildren(member.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedNodes.has(member.id)
    const spouse = member.spouseId ? familyMembers.find((m) => m.id === member.spouseId) : null

    return (
      <div className="relative">
        {/* Connecting Lines */}
        {level > 0 && !isSpouse && (
          <>
            <div
              className="absolute border-l-2 border-gray-300"
              style={{
                left: `${(level - 1) * 60 + 30}px`,
                top: "0px",
                height: "40px",
              }}
            />
            <div
              className="absolute border-t-2 border-gray-300"
              style={{
                left: `${(level - 1) * 60 + 30}px`,
                top: "40px",
                width: "30px",
              }}
            />
          </>
        )}

        {/* Corporate Card */}
        <div className="flex items-start mb-6" style={{ marginLeft: `${level * 60}px` }}>
          <div className="flex-shrink-0 mr-4">
            {hasChildren && !isSpouse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleExpanded(member.id)}
                className="h-8 w-8 p-0 border border-gray-300 bg-white hover:bg-gray-50"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && !isSpouse && <div className="w-8" />}
          </div>

          <Card className="flex-1 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
            <CardContent className="p-6">
              {spouse && !isSpouse ? (
                // Executive Partnership Display
                <div className="space-y-4">
                  <div className="mb-4"></div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Primary Executive */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-blue-300">
                            <AvatarImage
                              src={`/placeholder.svg?height=48&width=48&text=${getInitials(member.firstName, member.lastName)}`}
                            />
                            <AvatarFallback className="bg-blue-200 text-blue-800 font-semibold">
                              {getInitials(member.firstName, member.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {member.firstName} {member.lastName}
                            </h3>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(member)} font-medium`}>
                          <Crown className="h-3 w-3 mr-1" />
                          Level {getHierarchyLevel(member)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        {member.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{member.location}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                        {(member.donationAmount || 0) > 0 && (
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-3 w-3 mr-2" />
                            <span>${member.donationAmount?.toLocaleString()} Temple Contribution</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => onEdit(member)} className="text-xs">
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(member.id)} className="text-xs">
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Partner Executive */}
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-pink-300">
                            <AvatarImage
                              src={`/placeholder.svg?height=48&width=48&text=${getInitials(spouse.firstName, spouse.lastName)}`}
                            />
                            <AvatarFallback className="bg-pink-200 text-pink-800 font-semibold">
                              {getInitials(spouse.firstName, spouse.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {spouse.firstName} {spouse.lastName}
                            </h3>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(spouse)} font-medium`}>
                          <Crown className="h-3 w-3 mr-1" />
                          Level {getHierarchyLevel(spouse)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        {spouse.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{spouse.location}</span>
                          </div>
                        )}
                        {spouse.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{spouse.phone}</span>
                          </div>
                        )}
                        {spouse.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="truncate">{spouse.email}</span>
                          </div>
                        )}
                        {(spouse.donationAmount || 0) > 0 && (
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-3 w-3 mr-2" />
                            <span>${spouse.donationAmount?.toLocaleString()} Temple Contribution</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => onEdit(spouse)} className="text-xs">
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(spouse.id)} className="text-xs">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Actions */}
                  <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" onClick={() => onAddChild(member)} className="text-xs">
                      <Users className="h-3 w-3 mr-2" />
                      Add Child
                    </Button>
                  </div>
                </div>
              ) : (
                // Single Executive Display
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-14 w-14 border-2 border-gray-300">
                      <AvatarImage
                        src={`/placeholder.svg?height=56&width=56&text=${getInitials(member.firstName, member.lastName)}`}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold text-lg">
                        {getInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <Badge className={`${getStatusColor(member)} font-medium`}>
                          <Crown className="h-3 w-3 mr-1" />
                          Level {getHierarchyLevel(member)}
                        </Badge>
                        {(member.donationAmount || 0) > 0 && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <DollarSign className="h-3 w-3 mr-1" />${member.donationAmount?.toLocaleString()}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {member.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{member.location}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                        {hasChildren && (
                          <div className="flex items-center text-blue-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>
                              {children.length} Direct Report{children.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => onEdit(member)} className="text-xs">
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onAddSpouse(member)} className="text-xs">
                      Add Partner
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onAddChild(member)} className="text-xs">
                      Add Report
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(member.id)} className="text-xs">
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Direct Reports */}
        {hasChildren && isExpanded && !isSpouse && (
          <div className="relative">
            <div
              className="absolute border-l-2 border-gray-300"
              style={{
                left: `${level * 60 + 30}px`,
                top: "0px",
                height: `${children.length * 200}px`,
              }}
            />
            {children.map((child) => {
              // Check if this child is part of a couple and should be displayed as the primary member
              const childSpouse = child.spouseId ? familyMembers.find((m) => m.id === child.spouseId) : null

              // Only render the child if:
              // 1. They don't have a spouse, OR
              // 2. They have a spouse but their ID is numerically smaller (to ensure only one of the couple is rendered)
              if (!childSpouse || Number.parseInt(child.id) < Number.parseInt(childSpouse.id)) {
                return <CorporateNode key={child.id} member={child} level={level + 1} />
              }
              return null
            })}
          </div>
        )}
      </div>
    )
  }

  // Get root members (those without parents)
  const rootMembers = familyMembers.filter((member) => !member.parentId)

  // Filter out spouses from root members to avoid duplicate couples
  const processedRootMembers = rootMembers.filter((member) => {
    // If this member has a spouse
    if (member.spouseId) {
      const spouse = familyMembers.find((m) => m.id === member.spouseId)
      // Only include this member if their ID is numerically smaller than their spouse's
      // This ensures only one member of each couple is processed
      return spouse && Number.parseInt(member.id) < Number.parseInt(spouse.id)
    }
    // Include all non-spouse members
    return true
  })

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 min-h-[600px]">
      <div className="space-y-6">
        {processedRootMembers.map((rootMember) => (
          <CorporateNode key={rootMember.id} member={rootMember} level={0} />
        ))}
      </div>
    </div>
  )
}
