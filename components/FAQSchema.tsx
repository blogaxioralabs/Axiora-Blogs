// components/FAQSchema.tsx
// ADD-ONLY: FAQPage JSON-LD schema for tutorial/how-to blog posts
// Renders nothing visible — injects structured data for Google rich results

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  /** Array of question/answer pairs */
  faqs: FAQItem[];
  /** Optional: main entity URL (the page this FAQ belongs to) */
  mainEntityUrl?: string;
}

/**
 * FAQSchema — injects FAQPage structured data for Google rich snippets.
 *
 * When Google detects valid FAQPage schema, it can display expandable
 * Q&A directly in search results, improving CTR and visibility.
 *
 * Usage (in a blog post page):
 *   <FAQSchema
 *     faqs={[
 *       { question: "What is TypeScript?", answer: "TypeScript is..." },
 *       { question: "Why use it?", answer: "It adds type safety..." },
 *     ]}
 *     mainEntityUrl="https://www.axiorablogs.com/blog/typescript-guide"
 *   />
 *
 * Google guidelines:
 * - Only use on pages where the FAQ content is visible to users
 * - Don't use for advertising purposes
 * - Each question must be followed by its answer on the page
 */
export default function FAQSchema({ faqs, mainEntityUrl }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(mainEntityUrl && {
      '@id': mainEntityUrl,
    }),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
