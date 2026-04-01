"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/firestore";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "user",
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscriber to listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Handle setting secure session cookie if needed for middleware
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
        
        // Gửi token lên server để set cookie (API route)
        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, role: userRole }),
        });
      } else {
        setRole("user");
        // Đăng xuất (xóa cookie)
        await fetch("/api/auth/session", {
          method: "DELETE",
        });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
