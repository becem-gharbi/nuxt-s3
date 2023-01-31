//@ts-ignore
import { useRuntimeConfig } from "#imports";
import type { PrivateConfig, PublicConfig } from "../../types";

export const privateConfig = useRuntimeConfig().s3 as PrivateConfig;
export const publicConfig = useRuntimeConfig().public.s3 as PublicConfig;
