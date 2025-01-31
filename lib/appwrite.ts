'use server';

import { ID } from "appwrite";

const APPWRITE_PROJECT_ID = '679a3be3000b571ae49b'; // Replace with your Appwrite Project ID
const APPWRITE_ENDPOINT = 'https://appwrite.appunik-team.com/v1';// Update if self-hosted
const API_SECRET_KEY = 'standard_dd6984979c50faf8f62ad09a407f8662350b6c047eb69ad12f9ddf51b994aeedd431e23dd7b0e66eeb8e3a30036b297a0bd989c9421726dcecb99ffebfdee918e89a450c92c09d31266d2aa8ca6abf61b9eb331401fef7b129c539e5c0e760a3ca7b1c7c976eaf903516651b15d53f3b27bfefd91452b20d3693f454af4c7e04'

export async function signup(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${APPWRITE_ENDPOINT}/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': API_SECRET_KEY,
      },
      body: JSON.stringify({
        userId: ID.unique(),
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed.');
    }

    // Automatically log in the user after signup
    return await login(email, password);
  } catch (error) {
    console.error('❌ Signup error:', error);
    throw new Error('Signup Failed')
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${APPWRITE_ENDPOINT}/account/sessions/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': API_SECRET_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log('data', data);
    

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    return data; // Returns session object
  } catch (error) {
    console.error('❌ Login error:', error);
    throw new Error('Login failed.');
  }
}

export async function logout(sessionToken: string) {
  try {
    const response = await fetch(`${APPWRITE_ENDPOINT}/account/sessions/current`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-Session': sessionToken,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed.');
    }

    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw new Error('Logout failed.');
  }
}

export async function getUser(sessionToken: string) {
  try {
    const response = await fetch(`${APPWRITE_ENDPOINT}/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-Session': sessionToken,
      },
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Fetching user failed.');
    }

    return data; // Returns user object
  } catch (error) {
    console.error('❌ Get user error:', error);
    throw new Error('User retrieval failed.');
  }
}

export async function updateUserName(sessionToken: string, newName: string) {
  try {
    const response = await fetch(`${APPWRITE_ENDPOINT}/account/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-session': sessionToken, // Use session token
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update name.');
    }

    return data; // Returns updated user data
  } catch (error) {
    console.error('❌ Update Name error:', error);
    throw new Error('Failed to update name.');
  }
}

