import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function getClassificationColor(classification: string): string {
  switch (classification) {
    case 'flag': return 'classification-flag';
    case 'brown': return 'classification-brown';
    case 'red': return 'classification-red';
    case 'purple': return 'classification-purple';
    case 'orange': return 'classification-orange';
    case 'yellow': return 'classification-yellow';
    case 'blue': return 'classification-blue';
    default: return 'classification-blue';
  }
}

export function getClassificationName(classification: string): string {
  switch (classification) {
    case 'flag': return 'Emergency';
    case 'brown': return 'Critical';
    case 'red': return 'Concerning';
    case 'purple': return 'Warning';
    case 'orange': return 'Fair';
    case 'yellow': return 'Good';
    case 'blue': return 'Excellent';
    default: return 'Unknown';
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export function getDayLabels(): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push(days[date.getDay()]);
  }
  
  return result;
}
