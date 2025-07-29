export function generateWishlistNumber(commentCount: number) {
  if (commentCount <= 0) {
    return Math.floor(Math.random() * 50) + 1; // 如果评论数为0，返回1~100之间
  }

  const randomFactor = 10 + Math.random() * 20; // 范围：10 ~ 30
  const base = Math.sqrt(commentCount) * randomFactor;

  const offset = Math.floor(Math.random() * 201) - 100; // 范围：-100 ~ +100
  const result = Math.round(base + offset);

  return Math.max(result, 20); // 最小为1，避免负值
}
