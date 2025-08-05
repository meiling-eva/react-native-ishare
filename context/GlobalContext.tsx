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
    refreshLikePost: () => void
    refreshLikePostCnt: number
    // Side menu state
    isSideMenuVisible: boolean
    openSideMenu: () => void
    closeSideMenu: () => void
    toggleSideMenu: () => void
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
    refreshFollowingUserCnt: 0,
    refreshLikePost: () => { },
    refreshLikePostCnt: 0,
    // Side menu state
    isSideMenuVisible: false,
    openSideMenu: () => { },
    closeSideMenu: () => { },
    toggleSideMenu: () => { }
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
    const [refreshLikePostCnt, setRefreshLikePostCnt] = useState(0)

    // Side menu state
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(false)

    const openSideMenu = () => {
        setIsSideMenuVisible(true)
    }

    const closeSideMenu = () => {
        setIsSideMenuVisible(false)
    }

    const toggleSideMenu = () => {
        setIsSideMenuVisible(prev => !prev)
    }

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
                refreshFollowingUserCnt: refreshFollowingUserCnt,
                refreshLikePost: () => {
                    setRefreshLikePostCnt(prev => prev + 1)
                },
                refreshLikePostCnt: refreshLikePostCnt,
                // Side menu state
                isSideMenuVisible,
                openSideMenu,
                closeSideMenu,
                toggleSideMenu
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}