"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Users, Building2, TrendingUp, Award, DollarSign, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingMember(null)
                    setCoupleFormData((prev) => ({ ...prev, isCouple: true }))
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    {editingMember
                      ? "Update Employee Profile"
                      : selectedParent
                        ? coupleFormData.isCouple
                          ? `Add Executive Partnership under ${selectedParent.firstName} ${selectedParent.lastName}`
                          : `Add Direct Report for ${selectedParent.firstName} ${selectedParent.lastName}`
                        : selectedForSpouse
                          ? `Add Executive Partner for ${selectedForSpouse.firstName} ${selectedForSpouse.lastName}`
                          : coupleFormData.isCouple
                            ? "Add Executive Partnership"
                            : "Add New Member"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMember
                      ? "Update the employee information and role details."
                      : selectedParent
                        ? coupleFormData.isCouple
                          ? `Enter the details for the executive partnership reporting to ${selectedParent.firstName}.`
                          : `Enter the details for the new direct report under ${selectedParent.firstName}.`
                        : selectedForSpouse
                          ? `Enter the details for ${selectedForSpouse.firstName}'s executive partner.`
                          : coupleFormData.isCouple
                            ? "Enter the details for the executive partnership."
                            : "Enter the details for the new member."}
                  </DialogDescription>
                </DialogHeader>

                {!editingMember && !selectedForSpouse && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="isCouple"
                      checked={coupleFormData.isCouple}
                      onCheckedChange={(checked) =>
                        setCoupleFormData((prev) => ({ ...prev, isCouple: checked as boolean }))
                      }
                    />
                    <Label htmlFor="isCouple" className="text-sm font-medium">
                      {selectedParent ? "Add the Pair" : "Add the Pair"}
                    </Label>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {coupleFormData.isCouple && !editingMember && !selectedForSpouse ? (
                    // Executive Partnership Form
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Primary Executive */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          {selectedParent ? "Primary Executive" : "Executive Partner A"}
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="husbandFirstName">First Name *</Label>
                              <Input
                                id="husbandFirstName"
                                value={coupleFormData.husband.firstName || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    husband: { ...prev.husband, firstName: e.target.value },
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="husbandLastName">Last Name *</Label>
                              <Input
                                id="husbandLastName"
                                value={coupleFormData.husband.lastName || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    husband: { ...prev.husband, lastName: e.target.value },
                                    wife: { ...prev.wife, lastName: e.target.value },
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="husbandEmail">Email</Label>
                              <Input
                                id="husbandEmail"
                                type="email"
                                value={coupleFormData.husband.email || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    husband: { ...prev.husband, email: e.target.value },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="husbandPhone">Phone</Label>
                              <Input
                                id="husbandPhone"
                                type="tel"
                                value={coupleFormData.husband.phone || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    husband: { ...prev.husband, phone: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="husbandLocation">Current Location</Label>
                            <Input
                              id="husbandLocation"
                              placeholder="City, State, Country"
                              value={coupleFormData.husband.location || ""}
                              onChange={(e) =>
                                setCoupleFormData((prev) => ({
                                  ...prev,
                                  husband: { ...prev.husband, location: e.target.value },
                                  wife: { ...prev.wife, location: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="husbandDonation">Temple Contribution ($)</Label>
                            <Input
                              id="husbandDonation"
                              type="number"
                              min="0"
                              step="0.01"
                              value={coupleFormData.husband.donationAmount || 0}
                              onChange={(e) =>
                                setCoupleFormData((prev) => ({
                                  ...prev,
                                  husband: {
                                    ...prev.husband,
                                    donationAmount: Number.parseFloat(e.target.value) || 0,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Partner Executive */}
                      <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          {selectedParent ? "Partner Executive" : "Executive Partner B"}
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="wifeFirstName">First Name *</Label>
                              <Input
                                id="wifeFirstName"
                                value={coupleFormData.wife.firstName || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    wife: { ...prev.wife, firstName: e.target.value },
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="wifeLastName">Last Name *</Label>
                              <Input
                                id="wifeLastName"
                                value={coupleFormData.wife.lastName || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    wife: { ...prev.wife, lastName: e.target.value },
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="wifeEmail">Email</Label>
                              <Input
                                id="wifeEmail"
                                type="email"
                                value={coupleFormData.wife.email || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    wife: { ...prev.wife, email: e.target.value },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="wifePhone">Phone</Label>
                              <Input
                                id="wifePhone"
                                type="tel"
                                value={coupleFormData.wife.phone || ""}
                                onChange={(e) =>
                                  setCoupleFormData((prev) => ({
                                    ...prev,
                                    wife: { ...prev.wife, phone: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="wifeLocation">Current Location</Label>
                            <Input
                              id="wifeLocation"
                              placeholder="City, State, Country"
                              value={coupleFormData.wife.location || ""}
                              onChange={(e) =>
                                setCoupleFormData((prev) => ({
                                  ...prev,
                                  wife: { ...prev.wife, location: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="wifeDonation">Temple Contribution ($)</Label>
                            <Input
                              id="wifeDonation"
                              type="number"
                              min="0"
                              step="0.01"
                              value={coupleFormData.wife.donationAmount || 0}
                              onChange={(e) =>
                                setCoupleFormData((prev) => ({
                                  ...prev,
                                  wife: { ...prev.wife, donationAmount: Number.parseFloat(e.target.value) || 0 },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single Employee Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.gender || ""}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="donationAmount">Temple Contribution ($)</Label>
                          <Input
                            id="donationAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.donationAmount || 0}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                donationAmount: Number.parseFloat(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Current Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State, Country"
                          value={formData.location || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@company.com"
                            value={formData.email || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Role responsibilities, achievements, or other relevant information..."
                          value={formData.notes || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {editingMember
                        ? "Update Employee"
                        : coupleFormData.isCouple
                          ? "Add Executive Partnership"
                          : "Add Member"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
      </div>
    </div>
  )
}
