import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email }
        });
        return user;
    } catch (error) {
        console.error("getUserByEmail - Error fetching user by email:", email, error);
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        });
        return user;
    } catch (error) {
        console.error("getUserById - Error fetching user by ID:", id, error);
        return null;
    }
}