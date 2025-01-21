export type UserFieledShape = {
  username: string;
  id: string;
  verified: boolean;
  pinned_tweet_id: string;
  description: string;
  verified_type: string;
  url: string;
  protected: boolean;
  most_recent_tweet_id: string;
  entities: UserFieldEntityShape;
  name: string;
  created_at: string;
  public_metrics: UserPublicMetricsShape;
};

export type UserFieldEntityShape = {
  url: UserFieldEntityUrl[];
  description: {
    hashtags: UserFieldEntityHashtag[];
    mentions: UserFieldEntityMention[];
    cashtags: UserFieldEntityHashtag[];
  };
};

export type UserFieldEntityUrl = {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
};

export type UserFieldEntityHashtag = {
  start: number;
  end: number;
  tag: string;
};

export type UserFieldEntityMention = {
  start: number;
  end: number;
  username: string;
};

export type UserPublicMetricsShape = {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count: number;
  media_count: number;
};

export type UserMentionTimelineShape = {
  id: string;
  text: string;
};
