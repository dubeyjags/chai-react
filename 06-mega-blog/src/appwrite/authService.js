import { conf } from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account = null;
  constructor() {
    this.client
      .setEndpoint(conf.appwrite.url)
      .setProject(conf.appwrite.projectId);
    this.account = new Account(this.client);
  }

  async register({email, password, name}) {
    try {
      const response = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (response) {
        return this.login({email, password});
      } else {
        return response;
      }
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async login({email, password}) {
    try {
      const response = await this.account.createEmailSession(email, password);
      return response;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
