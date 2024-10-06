import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Listing, Place } from "../orm/entities";
import { MongoRepository } from "typeorm";
import { CreatePlaceRequest, GetDepartingPlacesRequest } from "../models";

@Service()
export class PlaceService {

    @InjectRepository(Place)
    private placeModel: MongoRepository<Place>;

    @InjectRepository(Listing)
    private listingModel: MongoRepository<Listing>;

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
        if(params.isTopCountry) {
            newPlace.isTopCountry = params.isTopCountry;
        } else {
            newPlace.isTopCountry = false;
        }
        newPlace.createdAt = new Date();
        newPlace.updatedAt = new Date();
        await this.placeModel.save(newPlace);
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
        const { limit, offset, searchTerm, country, topcountry } = params;

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

        if (topcountry) {
            query['isTopCountry'] = topcountry;
        }
        const places = await this.placeModel.find({
            where: query,
            take: limit,
            skip: offset
        })
        return places;
    }

    public async getTopCountries() {
        const query = {
            isTopCountry: true
        };
        const places = await this.placeModel.find({
            where: query
        });

        const placeIds = places.map(place => place.placeId);

        const palceCounts = await this.listingModel.aggregate([
            {
              $match: {
                to: { $in: placeIds }
              }
            },
            {
              $group: {
                _id: "$country", 
                count: { $sum: 1 } 
              }
            },
            {
              $project: {
                _id: 0, 
                country: "$_id", 
                count: 1             
              }
            }
          ]).toArray();

        const placesWithCount: any[] = []
        places.forEach(place => {
            const placeCount = palceCounts.find(placeCount => placeCount.to === place.country);
            placesWithCount.push({
                ...place,
                count: placeCount ? (placeCount as unknown as { count: number }).count : 0
            })
        });
        return placesWithCount;
    }
}