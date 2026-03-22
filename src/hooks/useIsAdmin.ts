"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/utils/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { FIRESTORE_ADMIN_ROLE } from "@/utils/auth";

const USERS_COLLECTION = "users";

/**
 * Admin = Firestore `users` doc where field `uid` matches Auth uid and `role === "admin"`.
 *
 * Your project uses auto-generated doc IDs with `uid` stored as a field (not doc id = uid),
 * so we query: `users` where `uid == auth.uid` (limit 1).
 *
 * Firestore rules must allow this read, e.g.:
 *   allow read: if request.auth != null && resource.data.uid == request.auth.uid;
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, USERS_COLLECTION),
      where("uid", "==", user.uid),
      limit(1)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docSnap = snap.docs[0];
        const role = docSnap?.data()?.role;
        setIsAdmin(
          typeof role === "string" &&
            role.toLowerCase() === FIRESTORE_ADMIN_ROLE.toLowerCase()
        );
        setLoading(false);
      },
      (err) => {
        console.error("useIsAdmin:", err);
        setIsAdmin(false);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  return { isAdmin, loading };
}
