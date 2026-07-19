import { Bot, FileSearch, FolderOpen, Settings, Upload, UserRound } from 'lucide-react';
import { ROUTES } from '@/constants';

export const quickActions = Object.freeze([
  { description: 'Start a focused conversation with your assistant.', icon: Bot, title: 'New chat', to: ROUTES.chat },
  { description: 'Add a source to your personal knowledge base.', icon: Upload, title: 'Upload document', to: ROUTES.documents },
  { description: 'Find answers across your connected knowledge.', icon: FileSearch, title: 'Search knowledge', to: ROUTES.search },
  { description: 'Browse and organize your saved sources.', icon: FolderOpen, title: 'View documents', to: ROUTES.documents },
  { description: 'Choose how LifeOS works for you.', icon: Settings, title: 'AI settings', to: ROUTES.settings },
  { description: 'Manage your personal LifeOS profile.', icon: UserRound, title: 'Profile', to: ROUTES.profile },
]);

export const recentChats = Object.freeze([
  { time: '12 min ago', title: 'Plan a more focused work week' },
  { time: 'Yesterday', title: 'Summarize my project notes' },
  { time: '2 days ago', title: 'Ideas for a personal learning plan' },
]);

export const recentDocuments = Object.freeze([
  { name: 'Product strategy brief.pdf', type: 'PDF', uploadedAt: 'Uploaded today' },
  { name: 'Team meeting notes.docx', type: 'DOCX', uploadedAt: 'Uploaded yesterday' },
  { name: 'Research bookmarks.txt', type: 'TXT', uploadedAt: 'Uploaded Jul 16' },
]);

export const usageMetrics = Object.freeze([
  { label: 'Chats', value: '24' },
  { label: 'Documents', value: '18' },
  { label: 'Tokens used', value: '48.2K' },
  { label: 'Knowledge files', value: '31' },
]);

export const recentActivity = Object.freeze([
  { detail: 'Product strategy brief.pdf', time: 'Today, 10:32 AM', title: 'Uploaded a document', type: 'upload' },
  { detail: 'Plan a more focused work week', time: 'Today, 9:48 AM', title: 'Started a new chat', type: 'chat' },
  { detail: 'Preferred AI provider', time: 'Yesterday, 4:10 PM', title: 'Changed settings', type: 'settings' },
  { detail: 'LifeOS workspace', time: 'Yesterday, 9:02 AM', title: 'Signed in', type: 'login' },
]);

export const systemStatuses = Object.freeze([
  { label: 'API', status: 'Healthy' },
  { label: 'Database', status: 'Healthy' },
  { label: 'Vector Store', status: 'Healthy' },
  { label: 'AI Service', status: 'Healthy' },
]);
