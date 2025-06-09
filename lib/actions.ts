"use server"

import { revalidatePath } from "next/cache"
import { readFamilyData, writeFamilyData, type FamilyMember } from "./file-storage"

// Get all family members
export async function getFamilyMembers() {
  return await readFamilyData()
}

// Add a new family member
export async function addFamilyMember(member: FamilyMember) {
  const members = await readFamilyData()
  members.push(member)
  const success = await writeFamilyData(members)

  if (success) {
    revalidatePath("/")
    return { success: true, message: "Family member added successfully" }
  }

  return { success: false, message: "Failed to add family member" }
}

// Add a couple (two family members with spouse relationship)
export async function addCouple(husband: FamilyMember, wife: FamilyMember) {
  const members = await readFamilyData()
  members.push(husband, wife)
  const success = await writeFamilyData(members)

  if (success) {
    revalidatePath("/")
    return { success: true, message: "Couple added successfully" }
  }

  return { success: false, message: "Failed to add couple" }
}

// Update an existing family member
export async function updateFamilyMember(updatedMember: FamilyMember) {
  const members = await readFamilyData()
  const index = members.findIndex((m) => m.id === updatedMember.id)

  if (index === -1) {
    return { success: false, message: "Family member not found" }
  }

  members[index] = updatedMember
  const success = await writeFamilyData(members)

  if (success) {
    revalidatePath("/")
    return { success: true, message: "Family member updated successfully" }
  }

  return { success: false, message: "Failed to update family member" }
}

// Delete a family member
export async function deleteFamilyMember(id: string) {
  const members = await readFamilyData()

  // Find the member to delete
  const memberToDelete = members.find((m) => m.id === id)
  if (!memberToDelete) {
    return { success: false, message: "Family member not found" }
  }

  // Remove spouse connection if exists
  let updatedMembers = members.filter((member) => member.id !== id)

  if (memberToDelete.spouseId) {
    updatedMembers = updatedMembers.map((member) =>
      member.id === memberToDelete.spouseId ? { ...member, spouseId: "" } : member,
    )
  }

  const success = await writeFamilyData(updatedMembers)

  if (success) {
    revalidatePath("/")
    return { success: true, message: "Family member deleted successfully" }
  }

  return { success: false, message: "Failed to delete family member" }
}
