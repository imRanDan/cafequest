"use client"

import { useEffect } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user ) {
            router.push("login");
        }
    }, [user, loading]);

    if (loading || !user ) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome to your dashboard!</h1>
            <p>You're logged in as {user.email}</p>
        </div>
    )
}