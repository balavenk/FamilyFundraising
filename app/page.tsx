"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Building2, TrendingUp, Award, DollarSign, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { CorporateHierarchy } from "@/components/corporate-hierarchy"

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

interface CoupleFormData {
  husband: Partial<FamilyMember>
  wife: Partial<FamilyMember>
  isCouple: boolean
}

export default function FamilyTreeApp() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    relationship: "",
    gender: "",
    location: "",
    phone: "",
    email: "",
    notes: "",
    parentId: "",
    spouseId: "",
    donationAmount: 0,
  })
  const [coupleFormData, setCoupleFormData] = useState<CoupleFormData>({
    husband: {
      firstName: "",
      lastName: "",
      birthDate: "",
      deathDate: "",
      relationship: "",
      gender: "Male",
      location: "",
      phone: "",
      email: "",
      notes: "",
      donationAmount: 0,
    },
    wife: {
      firstName: "",
      lastName: "",
      birthDate: "",
      deathDate: "",
      relationship: "",
      gender: "Female",
      location: "",
      phone: "",
      email: "",
      notes: "",
      donationAmount: 0,
    },
    isCouple: false,
  })
  const [selectedParent, setSelectedParent] = useState<FamilyMember | null>(null)
  const [selectedForSpouse, setSelectedForSpouse] = useState<FamilyMember | null>(null)

  const relationships = [
    "Self",
    "Spouse",
    "Parent",
    "Child",
    "Sibling",
    "Grandparent",
    "Grandchild",
    "Aunt/Uncle",
    "Cousin",
    "Other",
  ]

  const getTotalDonations = () => {
    return familyMembers.reduce((total, member) => total + (member.donationAmount || 0), 0)
  }

  const getExecutiveCount = () => {
    return familyMembers.filter((m) => ["Self", "Parent", "Grandparent", "Spouse"].includes(m.relationship)).length
  }

  const getManagerCount = () => {
    return familyMembers.filter((m) => ["Child", "Sibling", "Aunt/Uncle"].includes(m.relationship)).length
  }

  const getTeamMemberCount = () => {
    return familyMembers.filter((m) => ["Grandchild", "Cousin", "Other"].includes(m.relationship)).length
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (coupleFormData.isCouple) {
      // Handle couple submission
      if (!coupleFormData.husband.firstName || !coupleFormData.wife.firstName) return

      const husbandId = Date.now().toString()
      const wifeId = (Date.now() + 1).toString()

      const husband: FamilyMember = {
        id: husbandId,
        firstName: coupleFormData.husband.firstName || "",
        lastName: coupleFormData.husband.lastName || "",
        birthDate: coupleFormData.husband.birthDate || "",
        deathDate: coupleFormData.husband.deathDate || "",
        relationship: selectedParent ? "Child" : coupleFormData.husband.relationship || "",
        gender: "Male",
        location: coupleFormData.husband.location || "",
        phone: coupleFormData.husband.phone || "",
        email: coupleFormData.husband.email || "",
        notes: coupleFormData.husband.notes || "",
        parentId: selectedParent?.id || "",
        spouseId: wifeId,
        donationAmount: coupleFormData.husband.donationAmount || 0,
      }

      const wife: FamilyMember = {
        id: wifeId,
        firstName: coupleFormData.wife.firstName || "",
        lastName: coupleFormData.wife.lastName || "",
        birthDate: coupleFormData.wife.birthDate || "",
        deathDate: coupleFormData.wife.deathDate || "",
        relationship: selectedParent ? "Child" : coupleFormData.wife.relationship || "",
        gender: "Female",
        location: coupleFormData.wife.location || "",
        phone: coupleFormData.wife.phone || "",
        email: coupleFormData.wife.email || "",
        notes: coupleFormData.wife.notes || "",
        parentId: selectedParent?.id || "",
        spouseId: husbandId,
        donationAmount: coupleFormData.wife.donationAmount || 0,
      }

      setFamilyMembers((prev) => [...prev, husband, wife])
    } else {
      // Handle single person submission
      if (!formData.firstName || !formData.lastName) return

      const newMember: FamilyMember = {
        id: editingMember?.id || Date.now().toString(),
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        birthDate: formData.birthDate || "",
        deathDate: formData.deathDate || "",
        relationship: selectedParent ? "Child" : selectedForSpouse ? "Spouse" : formData.relationship || "",
        gender: formData.gender || "",
        location: formData.location || "",
        phone: formData.phone || "",
        email: formData.email || "",
        notes: formData.notes || "",
        parentId: selectedParent?.id || "",
        spouseId: selectedForSpouse?.id || "",
        donationAmount: formData.donationAmount || 0,
      }

      if (editingMember) {
        setFamilyMembers((prev) => prev.map((member) => (member.id === editingMember.id ? newMember : member)))
      } else {
        setFamilyMembers((prev) => {
          const updated = [...prev, newMember]

          // If adding a spouse, update the selected person's spouseId
          if (selectedForSpouse) {
            return updated.map((member) =>
              member.id === selectedForSpouse.id ? { ...member, spouseId: newMember.id } : member,
            )
          }

          return updated
        })
      }
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      deathDate: "",
      relationship: "",
      gender: "",
      location: "",
      phone: "",
      email: "",
      notes: "",
      parentId: "",
      spouseId: "",
      donationAmount: 0,
    })
    setCoupleFormData({
      husband: {
        firstName: "",
        lastName: "",
        birthDate: "",
        deathDate: "",
        relationship: "",
        gender: "Male",
        location: "",
        phone: "",
        email: "",
        notes: "",
        donationAmount: 0,
      },
      wife: {
        firstName: "",
        lastName: "",
        birthDate: "",
        deathDate: "",
        relationship: "",
        gender: "Female",
        location: "",
        phone: "",
        email: "",
        notes: "",
        donationAmount: 0,
      },
      isCouple: false,
    })
    setEditingMember(null)
    setSelectedParent(null)
    setSelectedForSpouse(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member)
    setFormData({
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      birthDate: member.birthDate || "",
      deathDate: member.deathDate || "",
      relationship: member.relationship || "",
      gender: member.gender || "",
      location: member.location || "",
      phone: member.phone || "",
      email: member.email || "",
      notes: member.notes || "",
      parentId: member.parentId || "",
      spouseId: member.spouseId || "",
      donationAmount: member.donationAmount || 0,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setFamilyMembers((prev) => {
      // Remove spouse connection if exists
      const memberToDelete = prev.find((m) => m.id === id)
      let updated = prev.filter((member) => member.id !== id)

      if (memberToDelete?.spouseId) {
        updated = updated.map((member) =>
          member.id === memberToDelete.spouseId ? { ...member, spouseId: "" } : member,
        )
      }

      return updated
    })
  }

  const handleAddChild = (parent: FamilyMember) => {
    setSelectedParent(parent)
    setEditingMember(null)
    setFormData({
      firstName: "",
      lastName: parent.lastName || "",
      birthDate: "",
      deathDate: "",
      relationship: "Child",
      gender: "",
      location: parent.location || "",
      phone: "",
      email: "",
      notes: "",
      parentId: parent.id,
      spouseId: "",
      donationAmount: 0,
    })
    setCoupleFormData({
      husband: {
        firstName: "",
        lastName: parent.lastName || "",
        birthDate: "",
        deathDate: "",
        relationship: "Child",
        gender: "Male",
        location: parent.location || "",
        phone: "",
        email: "",
        notes: "",
        donationAmount: 0,
      },
      wife: {
        firstName: "",
        lastName: parent.lastName || "",
        birthDate: "",
        deathDate: "",
        relationship: "Child",
        gender: "Female",
        location: parent.location || "",
        phone: "",
        email: "",
        notes: "",
        donationAmount: 0,
      },
      isCouple: true,
    })
    setIsAddDialogOpen(true)
  }

  const handleAddSpouse = (person: FamilyMember) => {
    setSelectedForSpouse(person)
    setEditingMember(null)
    setFormData({
      firstName: "",
      lastName: person.lastName || "",
      birthDate: "",
      deathDate: "",
      relationship: "Spouse",
      gender: person.gender === "Male" ? "Female" : "Male",
      location: person.location || "",
      phone: "",
      email: "",
      notes: "",
      parentId: "",
      spouseId: person.id,
      donationAmount: 0,
    })
    setIsAddDialogOpen(true)
  }

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Corporate Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Family Fundraising</h1>
              <p className="text-lg text-gray-600">Family structure and collection details</p>
            </div>
          </div>

          {/* Corporate Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center text-blue-800">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Financial Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-700">Total Contributions</p>
                    <p className="text-2xl font-bold text-blue-900">${getTotalDonations().toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-700">Contributors</p>
                    <p className="text-2xl font-bold text-green-800">
                      {familyMembers.filter((m) => (m.donationAmount || 0) > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Corporate Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-gray-900">{getExecutiveCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-gray-900">{getTeamMemberCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Corporate Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            Family Chart
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setExpandedNodes(new Set(familyMembers.map((m) => m.id)))}>
              Expand All
            </Button>
            <Button variant="outline" onClick={() => setExpandedNodes(new Set())}>
              Collapse All
            </Button>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          {/* Corporate Hierarchy Display */}
          {familyMembers.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your organizational structure by adding your first team member.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CorporateHierarchy
              familyMembers={familyMembers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              onAddSpouse={handleAddSpouse}
              expandedNodes={expandedNodes}
              onToggleExpanded={toggleExpanded}
            />
          )}
        </Dialog>
      </div>
    </div>
  )
}
