export type Tag = string;

export interface TagPopularity {
  popularity: Record<Tag, number>;
}

export interface TagRecommendation {
  recommendations: Tag[];
}

export interface Tags {
  tags: Tag[];
}
