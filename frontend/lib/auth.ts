import { AuthUser, User } from './types';
import { mockUsers } from './data';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'sidequest_auth';
const USERS_STORAGE_KEY = 'sidequest_users';

// Initialize localStorage with mock data
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  }
}

// Get all users from storage
export function getAllUsers(): Record<string, User> {
  if (typeof window === 'undefined') return mockUsers;
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : mockUsers;
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const auth = localStorage.getItem(STORAGE_KEY);
  if (!auth) return null;

  try {
    const authUser: AuthUser = JSON.parse(auth);
    return authUser
  } catch {
    return null;
  }
}

// Save users to storage
export function saveUsers(users: Record<string, User>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Sign up a new user
export async function signUp(username: string, email: string, password: string) {
  if (typeof window === 'undefined') throw new Error('Not in browser');


  // // Check if user already exists
  // if (Object.values(users).some((u) => u.email === email || u.username === username)) {
  //   throw new Error('User already exists');
  // }

  const data = {
    username,
    email,
    password
  }

  const response = await fetch('http://127.0.0.1:8000/api/auth/users/', 
    {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }
  )

  if (!response.ok){
    const err = await response.json()
    console.log(err)
    if(response.status === 400){
      if(err.password){
        throw new Error(err.password)
      }else if (err.email){
        throw new Error("Account already exists. Try logging in")
      }else if (err.username){
        throw new Error(err.username)
      }
    }
    throw new Error(err)
  }

  return
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  if (typeof window === 'undefined') throw new Error('Not in browser');


  const data = {
    email, 
    password
  }

  const response = await fetch('http://127.0.0.1:8000/api/auth/jwt/create/',
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }
  )

  if (!response.ok){
    const err = await response.json()
    if (response.status === 401) throw new Error ("Invalid username or password")
    else throw new Error("Internae")
  }

  const userData: AuthUser = await response.json();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

  return userData;
}

// Sign in with Google
export async function signInWithGoogle(token: string) {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const response = await fetch('http://127.0.0.1:8000/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || err.details || "Google authentication failed");
  }

  const userData: AuthUser = await response.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

  return userData;
}

// Sign out
export function signOut() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Update user profile
export function updateUser(userId: string, updates: Partial<User>): User {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const users = getAllUsers();
  const user = users[userId];

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = { ...user, ...updates };
  users[userId] = updatedUser;
  saveUsers(users);

  return updatedUser;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEY);
}
