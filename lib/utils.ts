import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CLOUD_NAME = "dnlkjlzzx";

export function getOptimizedImageUrl(url: string | null | undefined, width: number = 800): string {
  if (!url) return "/placeholder-image.jpg";
  
  if (url.includes("res.cloudinary.com")) {
    if (url.includes("upload/")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }
    return url;
  }
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto/${url}`;
}