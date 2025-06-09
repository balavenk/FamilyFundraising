"use server"

import fs from "fs/promises"
import path from "path"

// Define the data directory - this should be a writable directory on your server
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data")
const FAMILY_DATA_FILE = "family-data.json"

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Failed to create data directory:", error)
  }
}

// Interface for our family data
export interface FamilyMember {
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

// Read family data from file
export async function readFamilyData(): Promise<FamilyMember[]> {
  await ensureDataDir()

  try {
    const filePath = path.join(DATA_DIR, FAMILY_DATA_FILE)
    const fileExists = await fs
      .stat(filePath)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) {
      return []
    }

    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Failed to read family data:", error)
    return []
  }
}

// Write family data to file
export async function writeFamilyData(data: FamilyMember[]): Promise<boolean> {
  await ensureDataDir()

  try {
    const filePath = path.join(DATA_DIR, FAMILY_DATA_FILE)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
    return true
  } catch (error) {
    console.error("Failed to write family data:", error)
    return false
  }
}
