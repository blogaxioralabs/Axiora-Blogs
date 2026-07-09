'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Info, 
  Database, 
  Settings, 
  Globe, 
  Scale, 
  Share2, 
  HardDrive, 
  Lock, 
  UserCheck, 
  Baby, 
  Link as LinkIcon, 
  Edit3, 
  Mail, 
  MapPin, 
  Building,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "July 8, 2026";

  const sections = [
    { id: "intro", title: "Introduction", icon: Info },
    { id: "who-we-are", title: "Who We Are", icon: Building },
    { id: "info-collect", title: "Information We Collect", icon: Database },
    { id: "how-we-use", title: "How We Use It", icon: Settings },
    { id: "legal-basis", title: "Legal Basis", icon: Scale },
    { id: "advertising", title: "Advertising", icon: Share2 },
    { id: "how-we-share", title: "How We Share", icon: Globe },
    { id: "international", title: "Data Transfers", icon: Globe },
    { id: "retention", title: "Data Retention", icon: HardDrive },
    { id: "security", title: "Data Security", icon: Lock },
    { id: "rights", title: "Your Rights", icon: UserCheck },
    { id: "children", title: "Children's Privacy", icon: Baby },
    { id: "links", title: "External Links", icon: LinkIcon },
    { id: "changes", title: "Policy Changes", icon: Edit3 },
    { id: "contact", title: "Contact Us", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30">
      
      {/* Dynamic Ambient Background Glows (Adapts to Light/Dark Mode) */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />

      <main className="container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative z-10">
        
        {/* Hero Section - Ultra Modern & Responsive */}
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
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground dark:text-white/80">Transparency First</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 md:mb-6 text-foreground drop-shadow-sm dark:drop-shadow-2xl">
            Privacy Policy
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Your privacy is our priority. Discover how Axiora Blogs protects, uses, and respects your digital footprint in a connected world.
          </p>
          
          <div className="mt-6 md:mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-6 md:w-8 bg-border dark:bg-white/20" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-muted-foreground dark:text-white/50">Updated {lastUpdated}</span>
            <span className="h-px w-6 md:w-8 bg-border dark:bg-white/20" />
          </div>
        </motion.div>

        {/* Quick Jump Navigation (Pill style - Updated to Black Stroke & Text) */}
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

        {/* Main Content Sections - Dynamic Glassmorphic Cards */}
        <div className="space-y-8 md:space-y-12 lg:space-y-16">

          {/* 1.0 Introduction */}
          <SectionCard id="intro" title="1.0 Introduction" icon={Info}>
            <p className="text-base md:text-lg text-muted-foreground dark:text-slate-300 leading-relaxed mb-6">
              Axiora Blogs ("Axiora Blogs," "we," "us," or "our") is a Science, Technology, Engineering, and Mathematics (STEM) publication operated by Axiora Labs, based in Colombo, Sri Lanka. This Privacy Policy explains what information we collect when you visit axiorablogs.com (the "Site"), how we use and protect it, and what rights you have over it.
            </p>
            <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10 backdrop-blur-md">
              <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 leading-relaxed">
                This Policy covers the Site and its related features, including our newsletter, comment sections, contact form, and interactive tools (such as our article quiz generator). It does not apply to third-party websites we link to, or to other Axiora Labs properties, which may be governed by their own privacy policies. By using the Site, you agree to the collection and use of information as described here. If you do not agree, please discontinue use of the Site.
              </p>
            </div>
          </SectionCard>

          {/* 2.0 Who We Are - Bento Grid */}
          <SectionCard id="who-we-are" title="2.0 Who We Are" icon={Building}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <BentoItem icon={Building} label="Publisher" value="Axiora Labs" />
              <BentoItem icon={Globe} label="Website" value="axiorablogs.com" />
              <BentoItem icon={LinkIcon} label="Parent Company" value="axioralabs.com" />
              <BentoItem icon={Mail} label="Contact Email" value="contact@axioralabs.com" />
              <div className="sm:col-span-2">
                <BentoItem icon={MapPin} label="Location" value="180/A, Ragama Horape, Ragama, Sri Lanka." />
              </div>
            </div>
          </SectionCard>

          {/* 3.0 Information We Collect */}
          <SectionCard id="info-collect" title="3.0 Information We Collect" icon={Database}>
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-primary" /> 3.1 Information You Give Us Directly
                </h3>
                <ul className="grid gap-3 pl-2 md:pl-6">
                  <ListItem><strong>Contact form:</strong> your name, email address, and the content of your message.</ListItem>
                  <ListItem><strong>Newsletter:</strong> your email address, when you subscribe.</ListItem>
                  <ListItem><strong>Comments:</strong> your comment text, and your name if you choose to provide one (it's optional).</ListItem>
                  <ListItem><strong>Engagement features:</strong> when you "like" an article or use tools like our quiz generator, we may record basic, non-identifying interaction data tied to your session (e.g., which article you engaged with).</ListItem>
                </ul>
              </div>

              <div className="h-px w-full bg-border/50 dark:bg-gradient-to-r dark:from-transparent dark:via-white/10 dark:to-transparent" />

              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-primary" /> 3.1 Information Collected Automatically
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 pl-2 md:pl-6">Like most websites, we automatically collect some technical information when you browse the Site, including:</p>
                <ul className="grid sm:grid-cols-2 gap-3 pl-2 md:pl-6">
                  <ListItem>IP address and approximate location (country/city level)</ListItem>
                  <ListItem>Browser type, device type, and operating system</ListItem>
                  <ListItem>Pages viewed, time spent on page, and referring/exit pages</ListItem>
                  <ListItem>Date and time of visit</ListItem>
                </ul>
                <p className="text-sm md:text-base text-muted-foreground mt-4 pl-2 md:pl-6">We collect this through cookies, server logs, and similar technologies, which may involve analytics tools such as Google Analytics or comparable services.</p>
              </div>

              <div className="h-px w-full bg-border/50 dark:bg-gradient-to-r dark:from-transparent dark:via-white/10 dark:to-transparent" />

              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                  <h4 className="font-bold text-foreground mb-3">3.2 Cookies & Similar Tech</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground dark:text-slate-400 mb-3">
                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span> Essential functions (e.g., remembering light/dark theme)</li>
                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span> Analytics for understanding visitor usage</li>
                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span> Advertising (where applicable)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground dark:text-slate-500 mt-2 border-t border-border/50 dark:border-white/10 pt-2">
                    You can manage or disable cookies through your browser settings, though this may affect how parts of the Site function.
                  </p>
                </div>
                <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                  <h4 className="font-bold text-foreground mb-3">3.3 Third-Party Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground dark:text-slate-400 mb-3">
                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span> Social sharing buttons (WhatsApp, X/Twitter, Facebook, LinkedIn) take you to platforms where their own policies apply.</li>
                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span> AI chat links (ChatGPT or Gemini) send the article's title and URL to those providers.</li>
                  </ul>
                  <p className="text-xs text-muted-foreground dark:text-slate-500 mt-2 border-t border-border/50 dark:border-white/10 pt-2">
                    We don't control what they do with that data please check their respective privacy policies.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 4.0 How We Use Your Information */}
          <SectionCard id="how-we-use" title="4.0 How We Use Your Data" icon={Settings}>
            <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-4 px-2">We use the information described above to:</p>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <UseCard text="Operate, maintain, and improve the Site and its content" />
              <UseCard text="Respond to messages submitted through our contact form" />
              <UseCard text="Send newsletter updates to subscribers, until they unsubscribe" />
              <UseCard text="Display, moderate, and manage comments" />
              <UseCard text="Understand readership trends to guide future content" />
              <UseCard text="Keep the Site secure and prevent spam or abuse" />
              <UseCard text="Serve advertising, where applicable" />
            </div>
            <div className="relative p-5 md:p-6 rounded-2xl bg-primary/5 dark:bg-gradient-to-br dark:from-primary/10 dark:to-transparent border border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <p className="relative z-10 text-sm md:text-base text-foreground dark:text-slate-300 font-medium">
                We do not sell your personal information to third parties for their own direct marketing purposes. However, our third-party advertising partners (such as Google AdSense) may collect and share your technical data (like IP address and browsing behavior) to serve targeted ads, which may be considered a "sale" or "sharing" of data under certain privacy laws like the California CCPA.
              </p>
            </div>
          </SectionCard>

          {/* 5.0 Legal Basis */}
          <SectionCard id="legal-basis" title="5.0 Legal Basis (EEA/UK)" icon={Scale}>
            <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-6 px-2">If you are located in the European Economic Area or the UK, we process your information on the following bases:</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <LegalCard icon={UserCheck} title="Consent" desc="For newsletter sign-up and comments." color="bg-green-500/5 dark:from-green-500/20 dark:to-green-500/0" iconColor="text-green-600 dark:text-green-400" />
              <LegalCard icon={ShieldCheck} title="Legitimate Interest" desc="For basic analytics, site security, and improving our content." color="bg-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/0" iconColor="text-blue-600 dark:text-blue-400" />
              <LegalCard icon={Scale} title="Contractual Necessity" desc="For responding to your direct inquiries." color="bg-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/0" iconColor="text-purple-600 dark:text-purple-400" />
            </div>
          </SectionCard>

          {/* 6, 8, 9, 10 Combined Information Blocks */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <SectionCard id="advertising" title="6.0 Advertising" icon={Share2} className="h-full">
              <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed">
                Axiora Blogs may display advertising, including through third-party networks such as Google AdSense, to help support free access to our content. These networks may use cookies to serve relevant ads and measure performance. We do not control their data practices please review their policies, and use your browser, device, or Google's Ads Settings to manage ad personalization.
              </p>
            </SectionCard>
            
            <SectionCard id="international" title="8.0 Data Transfers" icon={Globe} className="h-full">
              <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed">
                Because the Site is globally accessible, your information may be transferred to service providers outside Sri Lanka (for hosting, analytics, etc.), which may have different data protection standards. Where this occurs, we take reasonable steps to keep your data protected consistent with this Policy.
              </p>
            </SectionCard>

            <SectionCard id="retention" title="9.0 Data Retention" icon={HardDrive} className="h-full">
              <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed mb-4">We retain personal data only for as long as necessary:</p>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-slate-400">
                <li><strong className="text-foreground">Contact forms:</strong> Retained while needed to address your inquiry, then deleted or archived.</li>
                <li><strong className="text-foreground">Newsletter emails:</strong> Kept until you unsubscribe.</li>
                <li><strong className="text-foreground">Comments:</strong> Kept until removed by you or by our moderator.</li>
              </ul>
            </SectionCard>

            <SectionCard id="security" title="10.0 Security" icon={Lock} className="h-full">
              <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed">
                We use reasonable technical and organizational safeguards to protect your information. That said, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </SectionCard>
          </div>

          {/* 7.0 How We Share */}
          <SectionCard id="how-we-share" title="7.0 How We Share Information" icon={Share2}>
            <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 mb-4 px-2">We may share information with:</p>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-4">
              <ShareItem title="Service Providers" desc="Entities who help us run the Site (e.g., hosting, email delivery, comment moderation, analytics), under confidentiality obligations." />
              <ShareItem title="Legal Authorities" desc="Where required by law or to protect our rights, users, or the public." />
              <ShareItem title="Successor Entity" desc="In the event Axiora Labs is involved in a merger, acquisition, or sale of assets." />
              <ShareItem title="Advertising Partners" desc="(such as Google AdSense), who may collect and use your technical data to serve personalized ads, as described in Section 6.0." />
            </div>
            <p className="font-semibold text-primary text-sm md:text-base px-2 mt-4">We do not sell or rent your personal data to third parties for their own marketing purposes.</p>
          </SectionCard>

          {/* 11.0 Your Rights - World Class Interactive Grid */}
          <SectionCard id="rights" title="11.0 Your Privacy Rights" icon={Globe}>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <RightCard 
                region="Sri Lanka" 
                law="PDPA No. 9 of 2022" 
                desc="Establishes rights including access, correction, and erasure of personal data. Phased implementation by Data Protection Authority." 
                flags={['lk']} 
              />
              <RightCard 
                region="EEA / UK" 
                law="GDPR" 
                desc="You have the right to access, correct, delete, restrict, port your data, object to processing, withdraw consent, and lodge complaints." 
                flags={['eu', 'gb']} 
              />
              <RightCard 
                region="California / US" 
                law="CCPA / CPRA" 
                desc="Right to know held info, request deletion/correction, and opt-out of data 'sale/sharing'. We won't discriminate for exercising rights." 
                flags={['us']} 
              />
              <RightCard 
                region="Canada" 
                law="PIPEDA & CPPA" 
                desc="Right to request access to held info, challenge accuracy or completeness, and request appropriate corrections or deletions." 
                flags={['ca']} 
              />
              <RightCard 
                region="AUS & NZ" 
                law="Privacy Acts 1988 & 2020" 
                desc="Processed under AUS Privacy Act 1988 (inc. 2024-2026 amendments) and NZ Act 2020. Right to access, correct, and submit complaints." 
                flags={['au', 'nz']} 
              />
              <RightCard 
                region="Latin America" 
                law="LGPD (Brazil)" 
                desc="Right to confirm processing, access data, correct inaccuracies, anonymize/delete unnecessary data, and revoke consent." 
                flags={['br']} 
              />
            </div>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/10 backdrop-blur-md text-center sm:text-left gap-4">
              <div>
                <h4 className="text-base md:text-lg font-bold text-foreground mb-1">Exercising your rights</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Email us and we will respond as required by applicable law.</p>
              </div>
              <a href="mailto:contact@axioralabs.com" className="w-full sm:w-auto px-6 py-3 rounded-full bg-foreground text-background font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2 group">
                contact@axioralabs.com
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </SectionCard>

          {/* 12, 13, 14 Combined - Updated to Rows (Stacked) */}
          <div className="flex flex-col gap-6">
            <SectionCard id="children" title="12.0 Children" icon={Baby}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Axiora Blogs is a general STEM publication and is not directed at children. We do not knowingly collect personal information from children under 13 (or the relevant minimum age in your jurisdiction). If you believe a child has provided us with personal data, please contact us and we will remove it.
              </p>
            </SectionCard>
            
            <SectionCard id="links" title="13.0 External Links" icon={LinkIcon}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Our articles often reference or link to external websites, products, and services (e.g., when discussing aircraft manufacturers or F1 teams). We are not responsible for the privacy practices or content of external sites, and encourage you to review their own policies.
              </p>
            </SectionCard>
            
            <SectionCard id="changes" title="14.0 Policy Changes" icon={Edit3}>
              <p className="text-muted-foreground dark:text-slate-400 text-sm md:text-base leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will update the "Last Updated" date above when we do, and note significant changes on this page.
              </p>
            </SectionCard>
          </div>

          {/* 15.0 Contact Us - Epic Footer Card */}
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
              <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">Questions about this Policy?</h2>
              <p className="text-sm md:text-base text-muted-foreground dark:text-slate-400 max-w-lg mx-auto mb-8 md:mb-10">
                We are committed to maintaining your trust. Reach out to Axiora Labs directly for any inquiries regarding this policy.
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

// --- Sub-components for ultra-clean, reusable code ---

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

function BentoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="p-4 md:p-5 rounded-2xl bg-secondary/30 dark:bg-black/40 border border-border/50 dark:border-white/5 flex items-start gap-3 md:gap-4 group hover:border-primary/30 transition-colors">
      <div className="p-2 rounded-lg bg-background dark:bg-white/5 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 truncate">{label}</div>
        <div className="text-sm md:text-base text-foreground font-medium truncate">{value}</div>
      </div>
    </div>
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

function UseCard({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5">
      <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
      <span className="text-xs md:text-sm font-medium text-foreground dark:text-slate-300">{text}</span>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function LegalCard({ icon: Icon, title, desc, color, iconColor }: any) {
  return (
    <div className={`p-5 md:p-6 rounded-2xl ${color} border border-border/50 dark:border-white/5 relative overflow-hidden`}>
      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${iconColor} mb-3 md:mb-4`} />
      <h4 className="text-base md:text-lg font-bold text-foreground mb-2">{title}</h4>
      <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400">{desc}</p>
    </div>
  );
}

function ShareItem({ title, desc }: any) {
  return (
    <div className="p-4 md:p-5 rounded-2xl bg-secondary/30 dark:bg-black/40 border border-border/50 dark:border-white/5 hover:bg-secondary/50 dark:hover:bg-white/5 transition-colors">
      <h4 className="font-bold text-sm md:text-base text-foreground mb-1">{title}</h4>
      <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400">{desc}</p>
    </div>
  );
}

function RightCard({ region, law, desc, flags = [] }: any) {
  return (
    <div className="p-5 md:p-6 rounded-2xl bg-secondary/30 dark:bg-black/40 border border-border/50 dark:border-white/5 hover:border-border dark:hover:border-white/20 transition-all group flex flex-row justify-between items-start gap-4">
      
      {/* Left Side: Text Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary mb-1.5 md:mb-2">{region}</div>
        <h4 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors pr-2 truncate whitespace-normal">{law}</h4>
        <p className="text-xs md:text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>

      {/* Right Side: Flags */}
      {flags.length > 0 && (
        <div className="flex shrink-0 -space-x-2.5 rtl:space-x-reverse pt-1">
          {flags.map((code: string, idx: number) => (
            <img 
              key={idx}
              src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
              alt={`${code} flag`}
              className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-2 border-background dark:border-[#0f172a] shadow-sm group-hover:scale-105 transition-transform duration-300 relative"
              style={{ zIndex: flags.length - idx }}
            />
          ))}
        </div>
      )}
      
    </div>
  );
}