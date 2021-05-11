type EnumType<type, data> = { type: type } & data;
declare type EnumSelect<ty, name> = Extract<ty, { type: name }>;

declare namespace embed {
  export type Embed =
    | EnumType<"None", unknown>
    | EnumType<"Website", metadata.Metadata>
    | EnumType<"Image", media.Image>;
}

declare namespace media {
  export enum ImageSize {
    Large,
    Preview,
  }

  export interface Image {
    url: string;
    width: number;
    height: number;
    size: ImageSize;
  }

  export interface Video {
    url: string;
    width: number;
    height: number;
  }
}

declare namespace special {
  export enum TwitchType {
    Channel,
    Video,
    Clip,
  }

  export enum BandcampType {
    Album,
    Track,
  }

  export type Special =
    | EnumType<"None", unknown>
    | EnumType<"Youtube", { id: string }>
    | EnumType<"Twitch", { id: string; content_type: TwitchType }>
    | EnumType<"Spotify", { id: string; content_type: string }>
    | EnumType<"Spotify", { id: string; content_type: string }>
    | EnumType<"Bandcamp", { id: string; BandcampType: string }>
    | EnumType<"Soundcloud", unknown>;
}

declare namespace metadata {
  export interface Metadata {
    url: string;
    special: special.Special | null;
    title?: string;
    description?: string;
    image?: media.Image;
    video?: media.Video;

    opengraph_type?: string;
    site_name?: string;
    icon_url?: string;
    color?: string;
  }
}

declare type Embed = embed.Embed;
