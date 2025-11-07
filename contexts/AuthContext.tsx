import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { User, UserRole } from '../types';
import { mockUsers, findUserByCredentials as findUserUtil } from '../data/mock';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  addUser: (newUserData: Omit<User, 'id'>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('canroad-user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Verify the stored user is still valid and active in our main user list
                const liveUser = users.find(u => u.id === parsedUser.id && u.isActive);
                if (liveUser) {
                    setCurrentUser(liveUser);
                } else {
                    localStorage.removeItem('canroad-user');
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('canroad-user');
        } finally {
            setIsLoading(false);
        }
    }, [users]);

    const login = async (email: string, password: string): Promise<User | null> => {
      return new Promise(resolve => {
        setTimeout(() => {
            const user = findUserUtil(users, email, password);
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('canroad-user', JSON.stringify(user));
                resolve(user);
            } else {
                resolve(null);
            }
        }, 500);
      });
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('canroad-user');
    };

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === updatedUser.id) {
                // Merge with existing user data to preserve fields not being updated (e.g., password)
                return { ...user, ...updatedUser };
            }
            return user;
        }));
    }, []);

    const addUser = useCallback((newUserData: Omit<User, 'id'>) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            ...newUserData,
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, users, isLoading, login, logout, updateUser, addUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};