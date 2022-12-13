export interface NodeData {
    url: string;
    provider: string;
}

export interface AllNodeData {
    [key: string]: NodeData;
}

export const allNodeData: AllNodeData = {
    prime: {
      url: "http://localhost:8546",
      provider: "http://localhost:8547",
    },
    "region-0": {
      url: "http://localhost:8578",
      provider: "http://localhost:8579",
    },
    "region-1": {
      url: "http://localhost:8580",
      provider: "http://localhost:8581",
    },
    "region-2": {
      url: "http://localhost:8582",
      provider: "http://localhost:8583",
    },
    "zone-0-0": {
      url: "http://localhost:8610",
      provider: "http://localhost:8610",
    },
    "zone-0-1": {
      url: "ws://localhost:8542",
      provider: "http://localhost:8643",
    },
    "zone-0-2": {
      url: "ws://localhost:8674",
      provider: "http://localhost:8675",
    },
    "zone-1-0": {
      url: "ws://localhost:8512",
      provider: "http://localhost:8613",
    },
    "zone-1-1": {
      url: "ws://localhost:8544",
      provider: "http://localhost:8645",
    },
    "zone-1-2": {
      url: "http://localhost:8576",
      provider: "http://localhost:8677",
    },
    "zone-2-0": {
      url: "ws://localhost:8614",
      provider: "http://localhost:8615",
    },
    "zone-2-1": {
      url: "ws://localhost:8646",
      provider: "http://localhost:8647",
    },
    "zone-2-2": {
      url: "ws://localhost:8678",
      provider: "http://localhost:8679",
    },
  };