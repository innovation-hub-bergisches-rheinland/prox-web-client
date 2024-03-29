export interface Tag {
  id: string;
  tagName: string;
  aliases: string[];
  count: number;
}

export interface SynchronizeTagsResponse {
  tags: Tag[];
}

export interface SynchronizeTagsRequest {
  tags: string[];
}

export interface UpdateTagRequest {
  aliases: string[];
  tagName: string;
}
