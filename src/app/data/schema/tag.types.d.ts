export interface Tag {
  id: string;
  tagName: string;
  aliases: string[];
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
