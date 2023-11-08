import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma'

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });


    return NextResponse.json({
        user: {
            email: user.email,
        },
    });
}
