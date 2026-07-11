// components/A11yImage.tsx
// Accessible image wrapper — enforces alt text, provides role="img"
// ADD-ONLY: wraps next/image with mandatory accessibility attributes

'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export type A11yImageProps = Omit<ImageProps, 'alt' | 'role'> & {
  /** REQUIRED: descriptive alt text for screen readers and SEO. Falls back to empty string with warning. */
  alt: string;
  /** Optional: role override (default: inferred from alt) */
  role?: 'img' | 'presentation';
  /** Optional: aria-label for additional context */
  ariaLabel?: string;
  /** Optional: caption for figure wrapper */
  caption?: string;
};

/**
 * A11yImage — drop-in replacement for next/image that enforces accessibility.
 *
 * - Requires `alt` prop (TypeScript enforced)
 * - Automatically sets role="presentation" for decorative images (alt="")
 * - Supports optional figure+figcaption pattern
 * - Adds aria-label when extra context is needed
 *
 * Usage:
 *   <A11yImage src="/hero.jpg" alt="Astronaut floating near ISS" width={800} height={600} />
 *   <A11yImage src="/decorative-bg.jpg" alt="" width={100} height={100} />
 */
export default function A11yImage({
  alt,
  role,
  ariaLabel,
  caption,
  ...imageProps
}: A11yImageProps) {
  const [hasError, setHasError] = useState(false);

  // Decorative images (empty alt) get role="presentation"
  const resolvedRole = role ?? (alt === '' ? 'presentation' : 'img');

  const imgElement = (
    <Image
      {...imageProps}
      alt={alt}
      role={resolvedRole}
      aria-label={ariaLabel || undefined}
      aria-hidden={alt === '' ? true : undefined}
      onError={() => setHasError(true)}
      // If image fails, still maintain space to prevent CLS
      style={{
        ...imageProps.style,
        ...(hasError ? { opacity: 0 } : {}),
      }}
    />
  );

  // When there's a caption, wrap in semantic figure
  if (caption) {
    return (
      <figure className="not-prose" role="figure" aria-label={ariaLabel || caption}>
        {imgElement}
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return imgElement;
}
