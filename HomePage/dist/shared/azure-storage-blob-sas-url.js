"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReadOnlySASUrl = void 0;
// Used to get read-only SAS token URL
const storage_blob_1 = require("@azure/storage-blob");
/**
 * Utility method for generating a secure short-lived SAS URL for a blob.
 * To know more about SAS URLs, see: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
 * @connectionString connectionString - string
 * @param containerName - string (User's alias)
 * @param filename - string
 */
const generateReadOnlySASUrl = (connectionString, containerName, filename) => __awaiter(void 0, void 0, void 0, function* () {
    // get storage client
    const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
    // get container client
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // connect to blob client
    const blobClient = containerClient.getBlobClient(filename);
    // Best practice: create time limits
    const SIXTY_MINUTES = 60 * 60 * 1000;
    const NOW = new Date();
    // Create SAS URL
    const accountSasTokenUrl = yield blobClient.generateSasUrl({
        startsOn: NOW,
        expiresOn: new Date(new Date().valueOf() + SIXTY_MINUTES),
        permissions: storage_blob_1.BlobSASPermissions.parse("r"),
        protocol: storage_blob_1.SASProtocol.Https, // Only allow HTTPS access to the blob
    });
    return {
        accountSasTokenUrl,
        storageAccountName: blobClient.accountName,
    };
});
exports.generateReadOnlySASUrl = generateReadOnlySASUrl;
//# sourceMappingURL=azure-storage-blob-sas-url.js.map