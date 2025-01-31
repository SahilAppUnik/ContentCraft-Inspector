// 'use server';

// import { account } from '@/lib/appwrite';
// import { AppwriteException, ID } from 'appwrite';
// import { cookies } from 'next/headers';

// export async function signup(email: string, password: string, name: string) {
//   try {
//     const user = await account.create(ID.unique(), email, password, name);
//     const session = await login(email, password);
//     return { user, session };
//   } catch (error) {
//     if (error instanceof AppwriteException) {
//       if (error.code === 409) {
//         throw new Error("User with this email already exists.");
//       }
//     }
//     console.error('❌ Signup error:', error);
//     throw new Error("Signup failed. Please try again.");
//   }
// }

// export async function login(email: string, password: string) {
//   try {
//     const session = await account.createEmailPasswordSession(email, password);
    
//     const user = await account.get();
//     console.log('userData', user);
    
//     return {session, user};
//   } catch (error) {
//     if (error instanceof AppwriteException) {
//       if (error.code === 401) {
//         throw new Error("Invalid email or password.");
//       }
//     }
//     console.error('❌ Login error:', error);
//     throw new Error("Login failed. Please try again.");
//   }
// }

// export async function logout() {
//   try {
//     await account.deleteSession('current');
//     const cookieStore = cookies();
//   } catch (error) {
//     console.error('Error during logout:', error);
//     throw error;
//   }
// }