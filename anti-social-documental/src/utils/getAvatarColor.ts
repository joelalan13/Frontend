export const getAvatarColor = (userId: string | undefined): string => {
  if (!userId) return "#00ff00";
  
  const colors = ["#00ff00", "#00d9ff", "#9d4edd", "#ff006e", "#fb5607", "#ffbe0b"];
  const index = parseInt(userId.slice(-2), 16) % colors.length;
  return colors[index];
};
