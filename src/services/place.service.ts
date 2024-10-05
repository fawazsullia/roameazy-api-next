import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Place } from "../orm/entities";
import { MongoRepository } from "typeorm";
import { CreatePlaceRequest, GetDepartingPlacesRequest } from "../models";

@Service()
export class PlaceService {

    @InjectRepository(Place)
    private placeModel: MongoRepository<Place>;

    async create(params: CreatePlaceRequest) {

        console.log(params);
        const existingPlace = await this.placeModel.findOne({ where: { placeId: params.placeId } });
        if (existingPlace) {
            throw new Error('Place already exists');
        }
        const newPlace = new Place();
        newPlace.name = params.name;
        newPlace.placeId = params.placeId;
        if (params.description) {
            newPlace.description = params.description;
        }
        if (params.images) {
            newPlace.images = params.images;
        }
        newPlace.country = params.country;
        if (params.isDeparture) {
            newPlace.isDeparture = params.isDeparture;
        }
        if (params.isDestination) {
            newPlace.isDestination = params.isDestination;
        }
        if (params.type) {
            newPlace.type = params.type;
        }
        newPlace.createdAt = new Date();
        newPlace.updatedAt = new Date();
        await this.placeModel.create(newPlace);
    }

    async getDeparting(params: GetDepartingPlacesRequest) {
        const { limit, offset, searchTerm, country } = params;

        const query = {
            isDeparture: true
        };

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            query['name'] = regex;
        }

        if (country) {
            query['country'] = country;
        }

        const places = await this.placeModel.find({
            where: query,
            take: limit,
            skip: offset
        })
        return places;
    }

    async getDestinations(params: GetDepartingPlacesRequest) {
        const { limit, offset, searchTerm, country } = params;

        const query = {
            isDestination: true
        };

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            query['name'] = regex;
        }

        if (country) {
            query['country'] = country;
        }

        const places = await this.placeModel.find({
            where: query,
            take: limit,
            skip: offset
        })
        return places;
    }
}