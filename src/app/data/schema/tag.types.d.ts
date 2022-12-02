export interface Tag {
  id: string;
  tag: string;
}

export interface SynchronizeTagsResponse {
  tags: string[];
}

export interface SynchronizeTagsRequest {
  tags: string[];
}
