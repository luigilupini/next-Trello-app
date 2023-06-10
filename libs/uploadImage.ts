import { ID, storage} from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return null;

    const fileUpload = await storage.createFile(
        '648156e3537ce7d24372',
        ID.unique(),
        file,
    );

    return fileUpload
}

export default uploadImage;