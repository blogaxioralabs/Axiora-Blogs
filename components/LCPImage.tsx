// components/LCPImage.tsx
// Priority image wrapper for Largest Contentful Paint (LCP) optimization
// ADD-ONLY: wraps next/image with fetchpriority, priority, and preload hints

import Image, { ImageProps } from 'next/image';
import A11yImage, { A11yImageProps } from './A11yImage';

export type LCPImageProps = A11yImageProps & {
  /** Whether this is the primary LCP element on the page. Default: true */
  isLCP?: boolean;
};

/**
 * LCPImage — optimized image for hero/LCP positions.
 *
 * Adds priority loading, high fetch priority, and prevents layout shift
 * by requiring explicit width/height or fill.
 *
 * Usage (hero image):
 *   <LCPImage src="/hero.webp" alt="..." width={1200} height={630} isLCP />
 *
 * Usage (non-LCP, but still needs priority):
 *   <LCPImage src="/banner.webp" alt="..." fill isLCP={false} />
 */
export default function LCPImage({
  isLCP = true,
  ...props
}: LCPImageProps) {
  // Only the first LCP image on the page should have priority=true
  // The isLCP flag lets you use the component without priority when needed

  const lcpProps: Omit<Partial<ImageProps>, 'role'> = isLCP
    ? {
        priority: true,
        fetchPriority: 'high' as const,
        loading: 'eager' as const,
      }
    : {
        loading: 'lazy' as const,
      };

  // Ensure dimensions are explicit to prevent CLS
  const hasExplicitSize = props.fill || (props.width && props.height);
  if (!hasExplicitSize && isLCP) {
    console.warn(
      '[LCPImage] LCP image should have explicit width/height or fill to prevent CLS. Image:',
      props.src
    );
  }

  return (
    <A11yImage
      {...props}
      {...lcpProps}
      // Ensure responsive sizing doesn't break LCP
      sizes={
        props.sizes ||
        '(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw'
      }
      quality={props.quality || 85}
    />
  );
}
