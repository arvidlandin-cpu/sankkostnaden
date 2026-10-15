/** Local editorial artwork shares the approved navy/sand/blue direction.
 * Decorative scenes illustrate a decision context, never an offer or result.
 */
export type ArtworkCategory = 'bredband' | 'el' | 'mobil' | 'forsakring' | 'ekonomi';
export function getCategoryArtwork(category: ArtworkCategory): { src: string; width: 1280; height: 853 } {
  return { src: `/design/category-${category}.webp`, width: 1280, height: 853 };
}
