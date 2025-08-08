import { ImageResult } from 'expo-image-manipulator'
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite'
import { User } from './modal'
const client = new Client()
client.setEndpoint('https://syd.cloud.appwrite.io/v1')
client.setProject('686b317000240b0341ba')
client.setPlatform('com.eva.ReactNative-iShare')

const databaseId = '686b90cf002658ff066e'
const collectionIdUser = '686b920e00194a4141f8'
const collectionIdFollow = '686f5a4c00363fb47095'
const collectionIdPost = '686f5a2700047b7da857'
const collectionIdComment = '686f5a40003c921f5c0f'
const collectionIdLikePost = '6881cf27000c725e6cb3'
const bucketId = '6874596e0013192ef96e'

const account = new Account(client)
const database = new Databases(client)
const avatars = new Avatars(client) 
const storage = new Storage(client)

export const uploadFile = async (image_key:string, file: ImageResult) => {
  try {
    const res = await storage.createFile(bucketId, image_key, {
      name: image_key,
      type: 'image/jpeg',
      size: file.height * file.width,
      uri: file.uri,
    })
    const fileId = res.$id
    const fileUrl = file.uri.toString()
    //const fileUrl = storage.getFileView(bucketId, fileId).toString()
    return {
      fileId: fileId, 
      fileUrl: fileUrl
    }
  } catch (error) {
    console.log('uploadFile error',error)
    throw error
  }
}

const createUser = async (email: string, username: string, user_id: string, avatar_url: string) => {
  try {
    //create user
    const user = await database.createDocument(databaseId, collectionIdUser, ID.unique(), {
      user_id: user_id,
      email: email,
      username: username,
      avatar_url: avatar_url,
      followers_count: 0,
      following_count: 0,
      signature: '',
    }) 
    return user.$id
  } catch (error) {
    console.log('createUser error',error)
    throw error
  }
}

export const getUserByUserId = async (user_id: string) => {
  try {
    const user = await database.listDocuments(databaseId, collectionIdUser, [Query.equal('user_id', user_id)])
    return user.documents[0]
  } catch (error) {
    console.log('getUserByUserId error',error)
    throw error
  }
}

export const login = async (email: string, password: string) => {
  try {
    const user = await account.createEmailPasswordSession(email, password)
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const logout = async () => {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.log('login error',error)
    throw error
  }
}

export const register = async (email: string, password: string, username: string) => {
  try {
    //signup
    const user = await account.create(ID.unique(), email, password, username)
    const user_id = user.$id
    const avatar_url = avatars.getInitialsURL(username).toString()
    const user_data = await createUser(email, username, user_id, avatar_url)
    //login
    await login(email, password)
    return user.$id
  } catch (error) {
    console.log('register error',error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const res = await account.get()
    if(res.$id){
        const user = await getUserByUserId(res.$id)
        return {
            user_id: res.$id,
            username: user.username,  
            email: user.email, 
            avatar_url: user.avatar_url,
            signature: user.signature,
            followers_count: user.followers_count,
            following_count: user.following_count,
        } as User
    }
    return null
  } catch (error) {
    console.log('getCurrentUser error',error)
    throw error
  }
}

export { account, collectionIdUser, database, databaseId }

export const handleFollowButton = async(user_id: string, creator_id: string, isFollowed: boolean) => {
  //if user follow creator, creator's follower count +1, user's following count + 1, follow table entry should be created
  //if user unfollow creator,
  if(isFollowed){ //if is followed, unfollow creator
    await unfollowUser(user_id, creator_id)
    await subUserFollowingCount(user_id)
    await unFollowCreatorCount(creator_id)
  }
  else{ //if is not followed, follow creator
    await followUser(user_id, creator_id)
    await addUserFollowingCount(user_id)
    await followCreatorCount(creator_id)
  }
}

//if follow creator, add 1 to user's following count
const addUserFollowingCount = async (user_id: string) => {
  try{
    const user = await getUserByUserId(user_id)
    if (!user) {
      throw new Error('User not found');
    }
    const currentFollowingCount = parseInt(user.following_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdUser, user.$id, {
      following_count: currentFollowingCount + 1
    })
    return res
  }
  catch(error){
    console.log('addUserFollowingCount error',error)
    throw error
  }
}

//if unfollow creator, substract 1 from user's following count
const subUserFollowingCount = async (user_id: string) =>{
  try{
    const user = await getUserByUserId(user_id)
    if (!user) {
      throw new Error('User not found');
    }
    const currentFollowingCount = parseInt(user.following_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdUser, user.$id, {
      following_count: Math.max(0, currentFollowingCount - 1)
    })
    return res
  }
  catch(error){
    console.log('subUserFollowingCount error',error)
    throw error
  }
}

//if follow creator, add 1 to creator's follower count
const followCreatorCount = async (user_id: string) => {
  try{
    const user = await getUserByUserId(user_id)
    if (!user) {
      throw new Error('User not found');
    }
    const currentFollowerCount = parseInt(user.followers_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdUser, user.$id, {
      followers_count: currentFollowerCount + 1 
    })
    return res
  }
  catch(error){
    console.log('followCreatorCount error',error)
    throw error
  }
}

//if unfollow creator, subtract 1 from creator's follower count
const unFollowCreatorCount = async (user_id: string) => {
  try{
    const user = await getUserByUserId(user_id)
    if (!user) {
      throw new Error('User not found');
    }
    const currentFollowerCount = parseInt(user.followers_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdUser, user.$id, {
      followers_count: Math.max(0, currentFollowerCount - 1)
    })
    return res
  }
  catch(error){
    console.log('unFollowCreatorCount error',error)
    throw error
  }
}

//post  
export const createPost = async (title: string, content: string, image: string, creator_id: string, creator_name: string, creator_avatar_url: string, like_count: number) => {
  try {
    const post = await database.createDocument(databaseId, collectionIdPost, ID.unique(), {
      title: title,
      content: content,
      image: image,
      creator_id: creator_id,
      creator_name:creator_name,
      creator_avatar_url: creator_avatar_url,
      like_count: 0
    })

    return post.$id
  } catch (error) {
    console.log('createPost error',error)
    throw error
  }
}

export const getPostById = async (post_id: string) => {
  try {
    const post = await database.getDocument(databaseId, collectionIdPost, post_id)
    return post
  } catch (error) {
    console.log('getPostById error',error)
    throw error
  }
}

export const getPosts = async (pageNumber: number, pageSize: number, user_ids?: string[], post_ids?: string[]) => {
  try {
    let queries = [Query.limit(pageSize), Query.offset(pageNumber * pageSize), Query.orderDesc('$createdAt')]
    if(user_ids && user_ids.length > 0){
      queries.push(Query.equal('creator_id', user_ids))
    }
    
    if(post_ids && post_ids.length > 0){
      queries.push(Query.equal('$id', post_ids))
    }
    const posts = await database.listDocuments(databaseId, collectionIdPost, queries)
    return posts.documents
  } catch (error) {
    console.log('getPosts error', error)
    throw error
  }
}

export const handleLikeRefChange = async (post_id: string, user_id: string, isLiked: boolean) => {
  if(isLiked){
    await unlikePostByUserId(post_id, user_id)
    await unlikePost(post_id);
  }
  else{
    await likePostByUserId(post_id, user_id)
    await likePost(post_id);
  }
}

const likePost = async (post_id: string) => {
  try{
    // First get the current post to check the like_count
    const currentPost = await database.getDocument(databaseId, collectionIdPost, post_id)
    const currentLikeCount = parseInt(currentPost.like_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdPost, post_id, {
      like_count: currentLikeCount + 1
    })
    return res
  }
  catch(error){
    console.log("likePost error", error)
    throw error
  }
}

const unlikePost = async (post_id: string) => {
  try{
    // First get the current post to check the like_count
    const currentPost = await database.getDocument(databaseId, collectionIdPost, post_id)
    const currentLikeCount = parseInt(currentPost.like_count) || 0
    const res = await database.updateDocument(databaseId, collectionIdPost, post_id, {
      like_count: Math.max(0, currentLikeCount - 1)
    })
    return res
  }
  catch(error){
    console.log("unlikePost error", error)
    throw error
  }
}

//likePostByUserId
export const getLikedPost = async (user_id: string) => {
  try{
    const posts = await database.listDocuments(databaseId, collectionIdLikePost, [Query.equal('user_id', user_id), Query.orderDesc('$createdAt')])
    return posts.documents
  }
  catch(error){
    console.log("getLikedPost error", error)
    throw error
  }
}


const likePostByUserId = async (post_id: string, user_id: string) => {
  try{
    // Check if like already exists to prevent duplicates
    const existingLike = await database.listDocuments(databaseId, collectionIdLikePost, [
      Query.equal('post_id', post_id), 
      Query.equal('user_id', user_id)
    ])
    
    if(existingLike.documents.length > 0){
      // Like already exists, return the existing one
      return existingLike.documents[0]
    }
    
    // Create new like if it doesn't exist
    const like = await database.createDocument(databaseId, collectionIdLikePost, ID.unique(), {
      post_id: post_id,
      user_id: user_id
    })
    return like
  }
  catch(error){
    console.log("likePostByUserId error", error)
    throw error
  }
}

const unlikePostByUserId = async (post_id: string, user_id: string) => { 
  try{
    const like = await database.listDocuments(databaseId, collectionIdLikePost, [
      Query.equal('post_id', post_id), 
      Query.equal('user_id', user_id)
    ])
    
    if(like.documents.length > 0){
      // Delete all like records for this user and post (in case of duplicates)
      const deletePromises = like.documents.map(doc => 
        database.deleteDocument(databaseId, collectionIdLikePost, doc.$id)
      )
      await Promise.all(deletePromises)
      //console.log(`Deleted ${like.documents.length} like record(s) for post ${post_id} and user ${user_id}`)
      return like.documents[0] // Return the first one for compatibility
    }
    return null
  }
  catch(error){
    console.log("unlikePostByUserId error", error)
    throw error
  }
}


//comment
export const createComment = async (post_id: string, from_user_id: string, user_name: string, user_avatar_url: string, content: string) => {
try{
  const comment = await database.createDocument(databaseId, collectionIdComment, ID.unique(), {
    post_id: post_id,
    from_user_id: from_user_id,
    from_user_name: user_name,
    from_user_avatar_url: user_avatar_url,
    content: content
  })
  return comment
} catch (error) {
  console.log('createComment error',error)
  throw error
}
}

export const getCommentsByPostId = async (post_id: string) => {
  try{
    const comments = await database.listDocuments(databaseId, collectionIdComment, [Query.equal('post_id', post_id)])
    return comments.documents
  } catch (error) {
    console.log('getCommentsByPostId error',error)
    throw error
  }
}

//follow
export const getFollowers = async (user_id: string) => {
  try {
    const followers = await database.listDocuments(databaseId, collectionIdFollow, [Query.equal('to_user_id', user_id)])
    return followers.documents
  } catch (error) {
    console.log('getFollowers error',error)
    throw error
  }
}

export const getFollowing = async (user_id: string) => {  
  try {
    const following = await database.listDocuments(databaseId, collectionIdFollow, [Query.equal('from_user_id', user_id)])
    return following.documents
  } catch (error) {
    console.log('getFollowing error',error)
    throw error
  }
}


export const followUser = async (from_user_id: string, to_user_id: string) => {
  try {
    const follow = await database.createDocument(databaseId, collectionIdFollow, ID.unique(), {
      from_user_id: from_user_id, 
      to_user_id: to_user_id,
    })
    return follow
  } catch (error) {
    console.log('followUser error',error)
    throw error
  }
}

export const unfollowUser = async (from_user_id: string, to_user_id: string) => {
  try {
    const follow = await database.listDocuments(databaseId, collectionIdFollow, [Query.equal('from_user_id', from_user_id), Query.equal('to_user_id', to_user_id)])
    if(follow.documents.length > 0){
      const deteleFollow = await database.deleteDocument(databaseId, collectionIdFollow, follow.documents[0].$id)
      return deteleFollow
    }
    return null
  } catch (error) {
    console.log('unfollowUser error', error)
    throw error
  }
}

export const isFollowing = async (from_user_id: string, to_user_id: string) => {
  try {
    const follow = await database.listDocuments(databaseId, collectionIdFollow, [Query.equal('from_user_id', from_user_id), Query.equal('to_user_id', to_user_id)])
    return follow.documents.length > 0
  } catch (error) {
    console.log('isFollowing error', error)
    throw error 
  }
}

export const getFollowingUsers = async (user_id: string) => {
  try {
    const followers = await database.listDocuments(databaseId, collectionIdFollow, 
      [Query.equal('from_user_id', user_id)])
    return followers.documents.map((item) => item.to_user_id)
  } catch (error) {
    console.log('getFollowingUsers error',error)
    throw error
  }
}