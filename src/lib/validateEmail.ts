export default function isValidEmail(email: string): boolean {
    // Simple email validation, can be replaced with a more robust check
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}