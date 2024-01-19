export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/((?!login|signup|api/v1/inventory).*)'],
};
