export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/((?!login|api/v1/inventory).*)'],
};
