'use client';

import { Button } from './ui/button';
import { Input } from './ui/input'; // You may need to add this: npx shadcn-ui@latest add input

export function NewsletterForm() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
        // In a real app, you would handle the form submission here
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Your email address" required />
            <Button type="submit">Subscribe</Button>
        </form>
    );
}