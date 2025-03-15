import { Client, Databases } from "appwrite";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1");
client.setProject("profile-website");

export const database = new Databases(client);
