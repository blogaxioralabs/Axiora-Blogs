'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Info, 
  FileText,
  MousePointer2,
  Copyright,
  MessageSquare,
  CheckSquare,
  Megaphone,
  Link as LinkIcon,
  MailOpen,
  AlertTriangle,
  Briefcase,
  XOctagon,
  Scale,
  Edit3,
  Scissors,
  Mail, 
  MapPin, 
  Building,
  ArrowRight,
  ChevronRight,
  Globe
} from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "July 8, 2026";

  // Navigation sections updated for Terms & Conditions
  const sections = [
    { id: "intro", title: "Acceptance & About", icon: FileText },
    { id: "use", title: "Use of Site", icon: MousePointer2 },
    { id: "ip", title: "Intellectual Property", icon: Copyright },
    { id: "comments", title: "Comments", icon: MessageSquare },
    { id: "accuracy", title: "Accuracy", icon: CheckSquare },
    { id: "legal", title: "Legal & Liability", icon: Scale },
    { id: "contact", title: "Contact Us", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />

      <main className="container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 dark:bg-white/5 border border-border/50 dark:border-white/10 backdrop-blur-md mb-6 md:mb-8 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground dark:text-white/80">User Agreement</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 md:mb-6 text-foreground drop-shadow-sm dark:drop-shadow-2xl">
            Terms & Conditions
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed px-2">
            The rules and guidelines for using Axiora Blogs. Please read these terms carefully before exploring our content.
          </p>
          
          <div className="mt-6 md:mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-6 md:w-8 bg-border dark:bg-white/20" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-muted-foreground dark:text-white/50">Updated {lastUpdated}</span>
            <span className="h-px w-6 md:w-8 bg-border dark:bg-white/20" />
          </div>
        </motion.div>

        {/* Quick Jump Navigation (Pill style - Black Stroke & Text) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2.5 mb-16 md:mb-24 max-w-4xl mx-auto px-2"
        >
          {sections.map((s) => (
            <a 
              key={s.id}
              href={`#${s.id}`}
              className="px-4 py-2 md:py-2.5 rounded-full bg-transparent border border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/10 text-xs md:text-sm font-bold text-black dark:text-white transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group shadow-sm"
            >
              <s.icon className="w-3.5 h-3.5 text-black dark:text-white group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">{s.title}</span>
            </a>
          ))}
        </motion.div>

        {/* Main Content Sections */}
        <div className="space-y-8 md:space-y-12 lg:space-y-16">

          {/* 1.0 & 2.0 Introduction & About */}
          <SectionCard id="intro" title="1.0 & 2.0 Acceptance and About" icon={FileText}>
            <p className="text-base md:text-lg text-muted-foreground dark:text-slate-300 leading-relaxed mb-6">
              Welcome to Axiora Blogs (axiorablogs.com), published by Axiora Labs ("Axiora Labs," "we," "us," "our"). By accessing or using the Site, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use the Site.
            </p>
            <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10 backdrop-blur-md flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
              <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 leading-relaxed">
                Axiora Blogs is a digital publication covering Science, Technology, Engineering, and Mathematics (STEM), including topics such as artificial intelligence, aviation, motorsport, and coding..etc. It is operated as a project of Axiora Labs.
              </p>
            </div>
          </SectionCard>

          {/* 3.0 Use of the Site */}
          <SectionCard id="use" title="3.0 Use of the Site" icon={MousePointer2}>
            <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-6 px-2">
              You may access and read Axiora Blogs for personal, non-commercial use. You agree not to:
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 md:gap-6 pl-2 md:pl-6">
              <ListItem>Copy, republish, or redistribute our articles or images beyond fair-use quoting with attribution, without our permission.</ListItem>
              <ListItem>Scrape, data-mine, or use automated tools to extract Site content in bulk.</ListItem>
              <ListItem>Reverse-engineer, interfere with, or attempt unauthorized access to the Site or its underlying systems.</ListItem>
              <ListItem>Use the Site for any unlawful purpose.</ListItem>
            </ul>
          </SectionCard>

          {/* 4.0 Intellectual Property */}
          <SectionCard id="ip" title="4.0 Intellectual Property" icon={Copyright}>
            <div className="space-y-6 md:space-y-8">
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 4.1 Our Content</h4>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                    All original articles, graphics, logos, and design elements on Axiora Blogs are the property of Axiora Labs or its contributing writers, and are protected by applicable copyright and intellectual property laws. You may share links to our articles and quote brief excerpts with proper attribution, but full reproduction requires our written permission.
                  </p>
                </div>
                
                <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 4.2 Third-Party Trademarks</h4>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                    Our articles frequently discuss third-party companies, products, and trademarks (e.g., aircraft manufacturers, F1 teams) for informational purposes. All such trademarks belong to their respective owners. Their mention does not imply affiliation, sponsorship, or endorsement unless explicitly stated.
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-border/50 dark:bg-gradient-to-r dark:from-transparent dark:via-white/10 dark:to-transparent" />

              <div>
                <h4 className="text-lg md:text-xl font-bold text-foreground mb-4">4.3 Copyright Infringement & Takedown</h4>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  We respect the intellectual property rights of others. If you believe content hosted on Axiora Blogs infringes your copyright, please notify us immediately by emailing <strong>contact@axioralabs.com</strong> with the following:
                </p>
                <div className="p-5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                  <ul className="grid sm:grid-cols-2 gap-3">
                    <ListItem>A description of the copyrighted work.</ListItem>
                    <ListItem>The exact URL or location of the material.</ListItem>
                    <ListItem>Your contact info (name, address, email, phone).</ListItem>
                    <ListItem>A good faith belief statement regarding unauthorized use.</ListItem>
                    <ListItem>A penalty of perjury statement confirming accuracy.</ListItem>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground mt-4 font-medium px-2">
                  We will promptly investigate and remove valid claims. We reserve the right to terminate accounts of repeat infringers.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 5.0 Comments */}
          <SectionCard id="comments" title="5.0 Comments and User Content" icon={MessageSquare}>
             <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-6 px-2">
               When you post a comment, you grant Axiora Blogs a non-exclusive, royalty-free license to display, reproduce, and moderate that content. You agree not to post content that:
             </p>
             <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5">
                <XOctagon className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground dark:text-slate-300">Is defamatory, obscene, hateful, or harassing.</span>
              </div>
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5">
                <XOctagon className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground dark:text-slate-300">Infringes intellectual property or privacy.</span>
              </div>
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5">
                <XOctagon className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground dark:text-slate-300">Contains spam, malware, or promotional links.</span>
              </div>
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5">
                <XOctagon className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground dark:text-slate-300">Is illegal under applicable law.</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/30 dark:bg-black/40 border border-border/50 dark:border-white/5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to remove any comment, and to restrict users without prior notice. You are solely responsible for your content. Axiora Labs acts merely as a passive host and is not liable for user statements. You agree not to hold Axiora Labs liable for any claims arising from comments.
              </p>
            </div>
          </SectionCard>

          {/* 6.0 Content Accuracy */}
          <SectionCard id="accuracy" title="6.0 Content Accuracy & Advice" icon={CheckSquare}>
            <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-6 px-2">
              We research and fact-check our articles carefully. Even so:
            </p>
            <div className="space-y-4">
              <div className="p-4 md:p-5 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 hover:border-primary/30 transition-colors">
                <h4 className="font-bold text-sm md:text-base text-foreground mb-2">Informational Purposes Only</h4>
                <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400">Content on Axiora Blogs is provided for general informational and educational purposes only. It is not a substitute for professional engineering, medical, veterinary, financial, legal, or safety-critical advice. Always consult a qualified professional.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 md:p-5 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 hover:border-primary/30 transition-colors">
                  <h4 className="font-bold text-sm md:text-base text-foreground mb-2">No Guarantees</h4>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400">We do not guarantee that all content is complete, current, or error-free, and we may update or correct articles as needed.</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 hover:border-primary/30 transition-colors">
                  <h4 className="font-bold text-sm md:text-base text-foreground mb-2">AI-Generated Features</h4>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400">AI features (e.g., quizzes, citation generators) are conveniences and may contain inaccuracies; they should not be relied upon as authoritative.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 7.0 to 15.0 Additional Legal Terms Stacked Vertically as Rows */}
          <div className="flex flex-col gap-6" id="legal">
            
            <SectionCard id="advertising" title="7.0 Advertising" icon={Megaphone}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Where the Site displays advertising, such ads are provided by third-party networks and do not represent an endorsement by Axiora Blogs of the advertised products or services. We are not responsible for the content of third-party ads or the practices of advertisers.
              </p>
            </SectionCard>

            <SectionCard id="links" title="8.0 Third-Party Links and Tools" icon={LinkIcon}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Our articles may link to external websites, or offer tools like "continue this conversation with ChatGPT/Gemini." These are provided for convenience; we do not control, and are not responsible for, the content, accuracy, or privacy practices of these third-party sites and tools.
              </p>
            </SectionCard>

            <SectionCard id="newsletter" title="9.0 Newsletter" icon={MailOpen}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                By subscribing to our newsletter, you consent to receive periodic emails from us. You may unsubscribe at any time using the link provided in each email.
              </p>
            </SectionCard>

            <SectionCard title="10.0 Limitation of Liability" icon={AlertTriangle}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                To the fullest extent permitted by law, Axiora Labs and its contributors will not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or reliance on its content, including but not limited to loss of data, profits, or business opportunities.
              </p>
            </SectionCard>

            <SectionCard title="11.0 Indemnification" icon={Briefcase}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                You agree to indemnify and hold harmless Axiora Labs, its contributors, and affiliates from any claims, damages, or expenses arising from your misuse of the Site or violation of these Terms.
              </p>
            </SectionCard>

            <SectionCard title="12.0 Termination" icon={XOctagon}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                We may suspend or terminate your access to the Site (including your ability to comment) at any time, for any reason, including violation of these Terms.
              </p>
            </SectionCard>

            <SectionCard title="13.0 Governing Law" icon={Scale}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                These Terms are governed by the laws of Sri Lanka, without regard to conflict-of-law principles. Any disputes will be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.
              </p>
            </SectionCard>

            <SectionCard title="14.0 Changes to These Terms" icon={Edit3}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                We may revise these Terms from time to time. Continued use of the Site after changes take effect constitutes acceptance of the revised Terms. We will update the "Last Updated" date above when we do.
              </p>
            </SectionCard>

            <SectionCard title="15.0 Severability" icon={Scissors}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </SectionCard>

          </div>

          {/* 16.0 Contact Us - Epic Footer Card */}
          <motion.section 
            id="contact"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 bg-card dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 border border-border/50 dark:border-white/10 text-center shadow-lg"
          >
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] dark:opacity-[0.05] mix-blend-overlay pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur-xl border border-primary/20 dark:border-primary/30">
                <Mail className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">Questions about these Terms?</h2>
              <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 max-w-lg mx-auto mb-8 md:mb-10">
                We are committed to clarity and transparency. Reach out to Axiora Labs directly for any inquiries regarding this agreement.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8">
                <a href="mailto:contact@axioralabs.com" className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md dark:shadow-[0_0_20px_rgba(var(--primary),0.4)] flex items-center justify-center gap-2">
                  Email Us <ArrowRight className="w-4 h-4" />
                </a>
                <a href="https://axioralabs.com" target="_blank" rel="noopener noreferrer" className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-secondary dark:bg-white/10 hover:bg-secondary/80 dark:hover:bg-white/20 text-secondary-foreground dark:text-white font-bold border border-border/50 dark:border-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" /> axioralabs.com
                </a>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 dark:bg-black/20 border border-border/50 dark:border-white/5">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">180/A, Ragama Horape, Ragama, Sri Lanka.</span>
              </div>
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}

// --- Sub-components (Reused exactly from Privacy Policy) ---

function SectionCard({ id, title, icon: Icon, children, className = "" }: any) {
  return (
    <motion.section 
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`scroll-mt-24 md:scroll-mt-32 p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-card dark:bg-white/[0.02] border border-border/50 dark:border-white/5 backdrop-blur-xl shadow-sm dark:shadow-2xl hover:border-border dark:hover:bg-white/[0.04] dark:hover:border-white/10 transition-all duration-500 group relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-2xl md:blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-foreground mb-6 md:mb-8 flex items-center gap-3 md:gap-4 tracking-tight">
          <div className="p-2.5 md:p-3 rounded-xl bg-secondary dark:bg-white/5 border border-border/50 dark:border-white/10 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:border-primary/20 dark:group-hover:border-primary/30 group-hover:text-primary transition-all duration-300">
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}

function ListItem({ children }: any) {
  return (
    <li className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-muted-foreground dark:text-slate-300">
      <span className="mt-1.5 md:mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0 dark:shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}