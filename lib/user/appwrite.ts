'use server';

import { ID } from "appwrite";

export async function signup(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID ?? "",
        'X-Appwrite-Key': process.env.API_SECRET_KEY ?? "",
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
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/account/sessions/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID ?? "",
        'X-Appwrite-Key': process.env.API_SECRET_KEY ?? "",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();    

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
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/account/sessions/current`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID ?? "",
        'X-Appwrite-Session': sessionToken
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
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID ?? "",
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
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/account/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID ?? "",
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

