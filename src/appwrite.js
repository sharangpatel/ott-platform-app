import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async(searchTerm,movie)=>{

//1. Use appwrite SDK to check if the search term exist in the database

    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.equal('searchTerm',searchTerm)
        ])

//2. If it does update the count
        console.log('What IS THIS',result);

    if(result.documents.length > 0){
        console.log("length:",result.documents.length);
        const doc = result.documents[0]
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,{
            count : doc.count + 1
        }) 
     }
//3 If it doesn't,create a new document with the search term & count to 1        
    else{
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
            searchTerm,
            count:1,
            movie_id:movie.id,
            poster_URL:`${movie.primaryImage}`
        })
    }
    
    } catch (error) {
        console.log(error);
    }


   
}

export const getTrendingMovies = async() => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('count')
        ])
        console.log('Trending movies count:', result.documents.length);
        console.log('Trending movies:', result.documents);
    return result.documents;

    } catch (error) {
        console.log(error);
    }
}