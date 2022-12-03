export interface Tag {
  id: string;
  tag: string;
}

export interface SynchronizeTagsResponse {
  tags: Tag[];
}

export interface SynchronizeTagsRequest {
  tags: string[];
}
