export interface Tag {
  id: string;
  tagName: string;
}

export interface SynchronizeTagsResponse {
  tags: Tag[];
}

export interface SynchronizeTagsRequest {
  tags: string[];
}
