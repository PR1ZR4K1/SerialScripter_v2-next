'use server'
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from 'next';


import { revalidateTag, revalidatePath } from 'next/cache'
import { Host } from "@prisma/client";
import { Session } from "next-auth";
 
export default async function revalidate() {
  revalidatePath("/");
  // console.log('gay')
}

// export async function fetchHosts(context: GetServerSidePropsContext):  Promise<Host[]> {
//     const session: Session | null = await getServerSession({ context });

//     const headers: HeadersInit = {};
//     console.log(session)
//     // if (session?.accessToken) {
//     //     headers['Authorization'] = `Bearer ${session.accessToken}`;
//     // }
//    try {
//        const response = await fetch("http://localhost:3000/api/v1/get/hosts", { next: { tags: ['fetchHosts'] }, headers: headers }); // Replace with your actual API endpoint
//        if (!response.ok) {
//            throw new Error(`HTTP error! Status: ${response.status}`);
//        }

//        const data = await response.json();
//         return data.data as Host[]; // Assuming the response data matches the Host array type

//    } catch (error) {
//        console.error("Error fetching host data:", error);
//        return [];
//    }
// }