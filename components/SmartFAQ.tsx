// components/SmartFAQ.tsx
// ADD-ONLY: Auto-detects FAQ sections in markdown content
// Parses "## FAQ" → "### Question?" → paragraph pairs
// Injects FAQPage JSON-LD for Google rich results
// Renders nothing visible

import FAQSchema from './FAQSchema';

interface SmartFAQProps {
  /** Raw markdown content from the blog post (nullable — handles empty gracefully) */
  content: string | null | undefined;
  /** Optional: page URL for the FAQ schema @id */
  pageUrl?: string;
}

interface ParsedFAQ {
  question: string;
  answer: string;
}

/**
 * Parses markdown content to find FAQ sections.
 *
 * Supported format:
 * ```
 * ## FAQ
 *
 * ### What is X?
 * X is a thing that does Y.
 *
 * ### How does it work?
 * It works by doing Z.
 * ```
 *
 * Detection rules:
 * - Looks for heading containing "FAQ" (case-insensitive)
 * - Following ### headings become questions
 * - Following paragraph text becomes answers
 * - Stops at next ## heading or end of content
 */
function parseFAQFromMarkdown(content: string): ParsedFAQ[] {
  if (!content) return [];

  const lines = content.split('\n');
  const faqs: ParsedFAQ[] = [];
  let inFAQSection = false;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect start of FAQ section: ## FAQ or ## Frequently Asked Questions etc.
    if (/^##\s+.*faq/i.test(line) || /^##\s+frequently\s+asked/i.test(line)) {
      inFAQSection = true;
      // Save any previous FAQ
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
      }
      currentQuestion = null;
      currentAnswer = [];
      continue;
    }

    // Exit FAQ section at next ## heading (not ###)
    if (inFAQSection && /^##\s/.test(line) && !/^###\s/.test(line)) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
      }
      inFAQSection = false;
      currentQuestion = null;
      currentAnswer = [];
      continue;
    }

    if (!inFAQSection) continue;

    // Skip empty lines
    if (line === '') continue;

    // Detect question: ### heading
    if (/^###\s+(.+)/.test(line)) {
      // Save previous FAQ
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
      }
      currentQuestion = line.replace(/^###\s+/, '').trim();
      currentAnswer = [];
      continue;
    }

    // Collect answer text (skip images, links, but keep text)
    if (currentQuestion) {
      // Strip markdown formatting but keep text
      const cleaned = line
        .replace(/!\[.*?\]\(.*?\)/g, '')      // images
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links → text
        .replace(/[*_~`#>|]/g, '')             // formatting chars
        .replace(/\s+/g, ' ')                  // normalize whitespace
        .trim();

      if (cleaned) {
        currentAnswer.push(cleaned);
      }
    }
  }

  // Save last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
  }

  return faqs;
}

/**
 * SmartFAQ — server/client-safe FAQ auto-detection.
 *
 * Place inside your blog post render tree. It parses the content,
 * extracts FAQ sections, and injects FAQPage structured data.
 *
 * Usage (in a server component):
 *   <SmartFAQ content={post.content} pageUrl={`${siteUrl}/blog/${post.slug}`} />
 *
 * Nothing is rendered — this is purely for SEO structured data injection.
 */
export default function SmartFAQ({ content, pageUrl }: SmartFAQProps) {
  const faqs = parseFAQFromMarkdown(content ?? '');

  if (faqs.length === 0) return null;

  return <FAQSchema faqs={faqs} mainEntityUrl={pageUrl} />;
}
