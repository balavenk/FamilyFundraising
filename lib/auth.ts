"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SHARED_PASSWORD = "mariamman"
const AUTH_COOKIE_NAME = "family-tree-auth"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface AuthResult {
  success: boolean
  message: string
}

// Authenticate user with email and password
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address",
    }
  }

  // Check password
  if (password !== SHARED_PASSWORD) {
    return {
      success: false,
      message: "Invalid password",
    }
  }

  // Set authentication cookie
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return {
    success: true,
    message: "Login successful",
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return !!authCookie?.value
}

// Get current user email
export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value || null
}

// Logout user
export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

// Middleware function to protect routes
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect("/login")
  }
}
