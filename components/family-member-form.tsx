"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

interface FamilyMemberFormProps {
  formData: any
  setFormData: (data: any) => void
  coupleFormData: any
  setCoupleFormData: (data: any) => void
  handleSubmit: (e: React.FormEvent) => void
  editingMember: any
  selectedParent: any
  selectedForSpouse: any
  resetForm: () => void
}

export function FamilyMemberForm({
  formData,
  setFormData,
  coupleFormData,
  setCoupleFormData,
  handleSubmit,
  editingMember,
  selectedParent,
  selectedForSpouse,
  resetForm,
}: FamilyMemberFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCoupleInputChange = (person: "husband" | "wife", field: string, value: any) => {
    setCoupleFormData((prev: any) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value,
      },
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupleFormData((prev: any) => ({ ...prev, isCouple: e.target.checked }))
  }

  const handleDateChange = (date: Date | undefined, person?: "husband" | "wife") => {
    if (person) {
      handleCoupleInputChange(person, "birthDate", date ? format(date, "yyyy-MM-dd") : "")
    } else {
      setFormData({ ...formData, birthDate: date ? format(date, "yyyy-MM-dd") : "" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {coupleFormData.isCouple ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Husband Form */}
            <div className="space-y-2">
              <Label htmlFor="husbandFirstName">Husband First Name</Label>
              <Input
                type="text"
                id="husbandFirstName"
                value={coupleFormData.husband.firstName}
                onChange={(e) => handleCoupleInputChange("husband", "firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="husbandLastName">Husband Last Name</Label>
              <Input
                type="text"
                id="husbandLastName"
                value={coupleFormData.husband.lastName}
                onChange={(e) => handleCoupleInputChange("husband", "lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="husbandBirthDate">Husband Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !coupleFormData.husband.birthDate && "text-muted-foreground",
                    )}
                  >
                    {coupleFormData.husband.birthDate ? (
                      format(new Date(coupleFormData.husband.birthDate), "MMMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={coupleFormData.husband.birthDate ? new Date(coupleFormData.husband.birthDate) : undefined}
                    onSelect={(date) => handleDateChange(date, "husband")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="husbandDonationAmount">Husband Donation Amount</Label>
              <Input
                type="number"
                id="husbandDonationAmount"
                value={coupleFormData.husband.donationAmount}
                onChange={(e) => handleCoupleInputChange("husband", "donationAmount", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wife Form */}
            <div className="space-y-2">
              <Label htmlFor="wifeFirstName">Wife First Name</Label>
              <Input
                type="text"
                id="wifeFirstName"
                value={coupleFormData.wife.firstName}
                onChange={(e) => handleCoupleInputChange("wife", "firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifeLastName">Wife Last Name</Label>
              <Input
                type="text"
                id="wifeLastName"
                value={coupleFormData.wife.lastName}
                onChange={(e) => handleCoupleInputChange("wife", "lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifeBirthDate">Wife Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !coupleFormData.wife.birthDate && "text-muted-foreground",
                    )}
                  >
                    {coupleFormData.wife.birthDate ? (
                      format(new Date(coupleFormData.wife.birthDate), "MMMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={coupleFormData.wife.birthDate ? new Date(coupleFormData.wife.birthDate) : undefined}
                    onSelect={(date) => handleDateChange(date, "wife")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifeDonationAmount">Wife Donation Amount</Label>
              <Input
                type="number"
                id="wifeDonationAmount"
                value={coupleFormData.wife.donationAmount}
                onChange={(e) => handleCoupleInputChange("wife", "donationAmount", Number(e.target.value))}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground",
                    )}
                  >
                    {formData.birthDate ? (
                      format(new Date(formData.birthDate), "MMMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                    onSelect={(date) => handleDateChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathDate">Death Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.deathDate && "text-muted-foreground",
                    )}
                  >
                    {formData.deathDate ? (
                      format(new Date(formData.deathDate), "MMMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deathDate ? new Date(formData.deathDate) : undefined}
                    onSelect={(date) => setFormData({ ...formData, deathDate: date ? format(date, "yyyy-MM-dd") : "" })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a gender" defaultValue={formData.gender} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a relationship" defaultValue={formData.relationship} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Self">Self</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Grandparent">Grandparent</SelectItem>
                  <SelectItem value="Grandchild">Grandchild</SelectItem>
                  <SelectItem value="Aunt/Uncle">Aunt/Uncle</SelectItem>
                  <SelectItem value="Cousin">Cousin</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donationAmount">Donation Amount</Label>
              <Input
                type="number"
                id="donationAmount"
                name="donationAmount"
                value={formData.donationAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
          </div>
        </>
      )}

      {!selectedParent && !selectedForSpouse && (
        <div className="flex items-center space-x-2">
          <Checkbox id="isCouple" checked={coupleFormData.isCouple} onCheckedChange={handleCheckboxChange} />
          <Label htmlFor="isCouple">Add as Couple</Label>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit">{editingMember ? "Update" : "Save"}</Button>
      </div>
    </form>
  )
}
