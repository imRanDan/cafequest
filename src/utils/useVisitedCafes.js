"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export function useVisitedCafes() {
  const [visitedCafes, setVisitedCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitedCafes = async () => {
      const user = auth.currentUser;
      if (!user) {
        setVisitedCafes([]);
        setLoading(false);
        return;
      }

      try {
        const visitedRef = collection(db, "users", user.uid, "visitedCafes");
        const snapshot = await getDocs(visitedRef);
        const cafes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVisitedCafes(cafes);
      } catch (error) {
        console.error("Error fetching visited cafes:", error);
        setVisitedCafes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitedCafes();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchVisitedCafes();
    });

    return () => unsubscribe();
  }, []);

  return { visitedCafes, loading };
}
