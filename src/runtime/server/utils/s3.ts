import { S3Client } from "@aws-sdk/client-s3";
import { privateConfig } from "./config";

const s3Client = new S3Client(privateConfig.client);

export { s3Client };
