export * from "./solidity";
export * from "./stylus";
export * from "./cairo";

const STAGE = process.env.NEXT_PUBLIC_STAGE;

export const baseUrl =
  STAGE === "local"
    ? "http://localhost:8000"
    : "https://verify.welldonestudio.io";
