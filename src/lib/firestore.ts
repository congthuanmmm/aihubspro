import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: any;
  lastLoginAt: any;
}

const ADMIN_EMAIL = "phamhaidangnb11@gmail.com";

/**
 * Đồng bộ người dùng vào Firestore khi họ đăng nhập.
 * Trả về role của người dùng.
 */
export async function syncUserToFirestore(user: User): Promise<string> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Đã tồn tại => Update lastLoginAt
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
    const data = userSnap.data() as UserData;
    return data.role || "user";
  } else {
    // Chưa tồn tại => Tạo mới (Role mặc định là user, ngoại trừ ADMIN_EMAIL)
    const role = user.email === ADMIN_EMAIL ? "admin" : "user";
    const newUserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: role,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, newUserData);
    return role;
  }
}

/**
 * Lấy role của người dùng từ Firestore.
 */
export async function getUserRole(uid: string): Promise<string> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role || "user";
  }
  return "user";
}
