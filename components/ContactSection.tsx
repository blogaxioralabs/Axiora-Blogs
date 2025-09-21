// components/ContactSection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, MessageSquare, Send, Building, Linkedin, Twitter } from 'lucide-react';

export function ContactSection() {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Form submitted:", formState);
            setSubmitMessage("Thank you! Your message has been sent successfully.");
            setFormState({ name: '', email: '', message: '' });
        } catch (error) {
            setSubmitMessage("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Section: Information */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div>
                            <span className="text-sm font-bold uppercase text-primary tracking-wider">Contact Us</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-2">
                                Let's Build the Future Together
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Have a project, a partnership idea, or just want to connect? We're here to listen and collaborate.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <a href="mailto:contact@axioralabs.com" className="flex items-start gap-4 group">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Email Us</h3>
                                    <p className="text-muted-foreground group-hover:text-primary transition-colors">contact@axioralabs.com</p>
                                </div>
                            </a>
                             <a href="https://axioralabs.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Building className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Our Main Hub</h3>
                                    <p className="text-muted-foreground group-hover:text-primary transition-colors">axioralabs.com</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Section: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 border rounded-xl shadow-lg">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" type="text" placeholder="Your Name" required value={formState.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formState.email} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea id="message" name="message" placeholder="Tell us about your project or inquiry..." required rows={6} value={formState.message} onChange={handleInputChange} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                            {submitMessage && <p className="text-sm text-center text-muted-foreground pt-2">{submitMessage}</p>}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}