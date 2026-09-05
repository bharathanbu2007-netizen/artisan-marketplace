import api from './api';

// TODO: register with Expo push notifications (expo-notifications) and send
// the Expo push token to a backend endpoint so the server can fan out
// background pushes via notificationService.js on the backend.
export const listNotifications = () => api.get('/notifications');
export const markNotificationRead = (id: string) => api.patch(`/notifications/${id}/read`);
