import { Service } from "typedi";

@Service()
export class SampleService {

    public async sample() {
        return true;
    }
}