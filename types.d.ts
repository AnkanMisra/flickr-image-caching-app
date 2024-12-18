declare module "expo-fast-image" {
    export interface FastImageSource {
      uri: string;
      priority?: "low" | "normal" | "high";
      cache?: "immutable" | "web" | "cacheOnly";
    }
  
    export const priority: {
      low: "low";
      normal: "normal";
      high: "high";
    };
  
    export const cacheControl: {
      immutable: "immutable";
      web: "web";
      cacheOnly: "cacheOnly";
    };
  }