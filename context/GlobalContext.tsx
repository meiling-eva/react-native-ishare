import { getCurrentUser } from "@/lib/appwrite"
import { User } from "@/lib/modal"
import { createContext, useContext, useEffect, useState } from "react"

type GlobalContextType = {
    user: User | null
    setUser: (user: User) => void
    refreshUser: () => void
    refreshPosts: () => void
    refreshPostsCnt: number
    refreshFollowingUser: () => void
    refreshFollowingUserCnt: number
}

const GlobalContext = createContext<GlobalContextType>({
    user: {
        user_id: '',
        email: '',
        username: '',
        avatar_url: '',
        followers_count: 0,
        following_count: 0,
        signature: ''
    },
    setUser: () => { },
    refreshUser: () => { },
    refreshPosts: () => { },
    refreshPostsCnt: 0,
    refreshFollowingUser: () => { },
    refreshFollowingUserCnt: 0
})

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(
        {
            user_id: '',
            email: '',
            username: '',
            avatar_url: '',
            followers_count: 0,
            following_count: 0,
            signature: ''
        }
    )

    const [refreshCnt, setRefreshCnt] = useState(0)
    const [refreshPostsCnt, setRefreshPostsCnt] = useState(0)
    const [refreshFollowingUserCnt, setRefreshFollowingUserCnt] = useState(0)

    const getUserInfo = async () => {
        try {
            const user = await getCurrentUser()
            if (user) {
                setUser(user)
            }
        } catch (error) {
            //console.error('Error getting user info:', error)
            setUser({
                user_id: '',
                email: '',
                username: '',
                avatar_url: '',
                followers_count: 0,
                following_count: 0,
                signature: ''
            })
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [refreshCnt])

    return (
        <GlobalContext.Provider 
        value={
            {
                user,
                setUser,
                refreshUser: () => {
                    setRefreshCnt(prev => prev + 1)
                },
                refreshPosts: () => {
                    setRefreshPostsCnt(prev => prev + 1)
                },
                refreshPostsCnt: refreshPostsCnt,
                refreshFollowingUser: () => {
                    setRefreshFollowingUserCnt(prev => prev + 1)
                },
                refreshFollowingUserCnt: refreshFollowingUserCnt
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}