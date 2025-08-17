"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

export type CurrentUser = {
  id: string
  name: string
  email: string
  profilePic?: string
  createdAt?: string
}

export function useCurrentUser() {
  const queryClient = useQueryClient()
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

  const query = useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/auth/current_user`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("unauthorized")
      const data = await res.json()
      if (!data?.success || !data?.user) throw new Error("unauthorized")
      return data.user as CurrentUser
    },
    retry: false,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["current_user"] })

  return { ...query, invalidate }
}
