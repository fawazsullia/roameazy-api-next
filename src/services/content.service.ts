import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Content } from "../orm/entities";
import { MongoRepository } from "typeorm";
import { CreateContentRequest, GetContentRequest, UpdateContentRequest } from "../models";

@Service()
export class ContentService {

    @InjectRepository(Content)
    private contentModel: MongoRepository<Content>;

    public async create(body: CreateContentRequest) {
        const { key, group, data } = body;
        const existingContent = await this.contentModel.findOne({ where: { key, group } });
        if (existingContent) {
            throw new Error('Content already exists');
        }
        const content = new Content();
        content.key = key;
        content.group = group;
        content.data = data;
        content.createdAt = new Date();
        content.updatedAt = new Date();
        return this.contentModel.save(content);
    }

    // here, make provisions to only update single keys later
    public async update(body: UpdateContentRequest) {
        const { key, group, data } = body;
        const content = await this.contentModel.findOne({ where: { key, group } });
        if (!content) {
            throw new Error('Content not found');
        }
        content.data = data;
        content.updatedAt = new Date();
        return this.contentModel.save(content);
    }

    public async get(params: GetContentRequest) {
        const { key, group } = params;
        const response = await this.contentModel.findOne({ where: { key, group } });
        if (!response) {
            throw new Error('Content not found');
        }
        return response;
    }
}