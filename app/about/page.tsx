import { BrainCircuit, Rocket, Dna, Telescope, CheckCircle, Lightbulb, Microscope } from 'lucide-react';
import Link from 'next/link';
import { AdBanner } from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { ContactSection } from '@/components/ContactSection';

export default function AboutPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section - Added more bottom padding (pb-16 / md:pb-20) */}
            <section className="container mx-auto text-center pt-20 pb-16 md:pt-28 md:pb-20">
                <a 
                    href="https://axioralabs.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-secondary text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-4"
                >
                    Powered by Axiora Labs
                </a>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
                    Exploring the Frontiers of Knowledge
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Axiora Blogs is the innovation and knowledge hub of Axiora Labs, dedicated to sharing discoveries in Science, Technology, Engineering, and Mathematics.
                </p>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-secondary">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
                            <Rocket className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold">Innovation</h3>
                            <p className="text-xs text-muted-foreground mt-1">Pushing the boundaries of what is possible.</p>
                        </div>
                         <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
                            <Dna className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold">Discovery</h3>
                            <p className="text-xs text-muted-foreground mt-1">Uncovering the secrets of the universe.</p>
                        </div>
                         <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
                            <BrainCircuit className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold">Knowledge</h3>
                             <p className="text-xs text-muted-foreground mt-1">Sharing insights that shape the future.</p>
                        </div>
                         <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
                            <Telescope className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold">Exploration</h3>
                             <p className="text-xs text-muted-foreground mt-1">Venturing into new frontiers of STEM.</p>
                        </div>
                    </div>
                     <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Mission</h2>
                        <p className="text-muted-foreground mb-4">
                            At Axiora Labs, our core mission is to decode the complexities of Science, Technology, Engineering, and Mathematics. <strong>Axiora Blogs</strong> is our platform to share these groundbreaking discoveries with the world. We believe that by making knowledge accessible and engaging, we can inspire the next generation of thinkers, creators, and problem-solvers.
                        </p>
                        <p className="text-muted-foreground">
                            We are not just observers; we are active participants in the journey of innovation, committed to developing next-generation solutions and fostering a community dedicated to progress.
                        </p>
                    </div>
                </div>
            </section>

            {/* OUR CORE VALUES SECTION */}
            <section className="py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Core Values</h2>
                    <p className="max-w-2xl mx-auto text-muted-foreground mb-12">The principles that guide our content and community.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card border rounded-lg p-8 shadow-sm">
                            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Integrity & Accuracy</h3>
                            <p className="text-muted-foreground mt-2">Every article is thoroughly researched and fact-checked to ensure you receive reliable information.</p>
                        </div>
                        <div className="bg-card border rounded-lg p-8 shadow-sm">
                            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                                <Lightbulb className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Curiosity & Passion</h3>
                            <p className="text-muted-foreground mt-2">We are driven by a deep passion for discovery and a desire to make complex topics understandable.</p>
                        </div>
                        <div className="bg-card border rounded-lg p-8 shadow-sm">
                            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                                <Microscope className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Clarity & Simplicity</h3>
                            <p className="text-muted-foreground mt-2">We break down intricate subjects into clear, concise, and engaging content for everyone.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* "Join Us" Section */}
            <section className="container mx-auto text-center py-20 border-t">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Join Our Journey</h2>
                 <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
                    Whether you are a student, a professional, or simply a curious mind, Axiora Blogs is your daily dose of innovation. Explore our articles, subscribe to our newsletter, and follow us on social media to stay connected with the future.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/blog" passHref>
                        <Button size="lg">Explore Articles</Button>
                    </Link>
                </div>
            </section>

            {/* ADVERTISEMENT SECTION */}
            <section className="container mx-auto pb-20">
                <div className="max-w-4xl mx-auto">
                    <AdBanner />
                </div>
            </section>

            {/* NEW CONTACT US SECTION */}
            <ContactSection />
        </div>
    );
}