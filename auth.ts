import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');

export async function getUser(email: string): Promise<User | undefined> {
    try {
        await client.connect();
        const database = client.db(process.env.MONGODB_DB);
        const usersCollection = database.collection<User>('users');
        const fetched_user = await usersCollection.findOne({ email });
        if(!fetched_user) {
            throw new Error('User not found.');
           
        }
        const user = {
            name: fetched_user.name,
            user_role: fetched_user.user_role,
            email: fetched_user.email,
            contact: fetched_user.contact,
            address: fetched_user.address,
            image_url: fetched_user.image_url,
            id: fetched_user._id.toString(), // Convert ObjectId to string
            password: fetched_user.password,
            created_at: fetched_user.created_at
        }
        return user || undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        await client.close();
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                   

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log('invalid credentials');
                return null;
            },
        }),
    ],
});


