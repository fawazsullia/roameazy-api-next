import { Service } from "typedi";

@Service()
export class UserService {
  async getUserById(id: string) {
    return { id, name: "John Doe" };
  }
}