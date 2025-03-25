export const getTotalUnreadCount = (groupChats, directChats) => {
  const groupUnread = groupChats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  const directUnread = directChats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  return groupUnread + directUnread;
};