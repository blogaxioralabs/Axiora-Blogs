import { BrainCircuit, Rocket, Dna, Telescope, PenSquare, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="container mx-auto text-center py-20 md:py-28">
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
                            At Axiora Labs, our core mission is to decode the complexities of Science, Technology, Engineering, and Mathematics. **Axiora Blogs** is our platform to share these groundbreaking discoveries with the world. We believe that by making knowledge accessible and engaging, we can inspire the next generation of thinkers, creators, and problem-solvers.
                        </p>
                        <p className="text-muted-foreground">
                            We are not just observers; we are active participants in the journey of innovation, committed to developing next-generation solutions and fostering a community dedicated to progress.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* "Join Us" Section */}
            <section className="container mx-auto text-center py-20">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Join Our Journey</h2>
                 <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
                    Whether you are a student, a professional, or simply a curious mind, Axiora Blogs is your daily dose of innovation. Explore our articles, subscribe to our newsletter, and follow us on social media to stay connected with the future.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/blog">
                        <span className="inline-flex items-center justify-center h-10 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-primary hover:bg-primary/90 focus:shadow-outline focus:outline-none">
                            Explore Articles
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
}