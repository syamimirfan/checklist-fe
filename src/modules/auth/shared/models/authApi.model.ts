// This file defines the AuthUser interface, which represents the structure of an authenticated user object in the application. The interface includes three properties: id, email, and name, all of which are of type string. This interface can be used throughout the application to ensure consistent handling of authenticated user data.
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface DummyUser {
  id: string;
  email: string;
  name: string;
  password: string;
  emailVerified: boolean;
}
