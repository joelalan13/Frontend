/**
 * Calcula si una fecha es mayor a 6 meses desde hoy
 */
export const isOlderThanSixMonths = (date: Date | string | undefined): boolean => {
  if (!date) return false

  const postDate = new Date(date)
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  return postDate < sixMonthsAgo
}

/**
 * Filtra posts que no sean más antiguos que 6 meses
 */
export const filterRecentPosts = (posts: any[]): any[] => {
  return posts.filter((post) => !isOlderThanSixMonths(post.createdAt))
}
