export interface NodeData {
    url: string;
    provider: string;
}

export interface AllNodeData {
    [key: string]: NodeData;
}

export const allNodeData: AllNodeData = {
    // prime: {
    //   url: "http://localhost:8546",
    //   provider: "http://localhost:8546",
    // },
    // "region-0": {
    //   url: "http://localhost:8578",
    //   provider: "http://localhost:8578",
    // },
    // "region-1": {
    //   url: "http://localhost:8580",
    //   provider: "http://localhost:8580",
    // },
    // "region-2": {
    //   url: "http://localhost:8582",
    //   provider: "http://localhost:8582",
    // },
    "zone-0-0": {
      url: "http://localhost:8610",
      provider: "http://localhost:8610",
    },
    "zone-0-1": {
      url: "ws://localhost:8542",
      provider: "http://localhost:8542",
    },
    "zone-0-2": {
      url: "ws://localhost:8674",
      provider: "http://localhost:8674",
    },
    "zone-1-0": {
      url: "ws://localhost:8512",
      provider: "http://localhost:8512",
    },
    "zone-1-1": {
      url: "ws://localhost:8544",
      provider: "http://localhost:8544",
    },
    "zone-1-2": {
      url: "http://localhost:8576",
      provider: "http://localhost:8576",
    },
    "zone-2-0": {
      url: "ws://localhost:8614",
      provider: "http://localhost:8614",
    },
    "zone-2-1": {
      url: "ws://localhost:8646",
      provider: "http://localhost:8646",
    },
    "zone-2-2": {
      url: "ws://localhost:8678",
      provider: "http://localhost:8678",
    },
  };