import { httpClient } from '@/lib';

export const fetchDashboardOverview = async () => (await httpClient.get('/dashboard/overview')).data?.data;
