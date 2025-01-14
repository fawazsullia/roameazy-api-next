import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { v4 as uuidV4 } from "uuid"
import { Company, Listing, User } from "../orm/entities";
import { MongoRepository, ObjectLiteral } from "typeorm";
import { CreateListingRequest, GetListingRequest } from "../models";
import { StringUtil } from "../utils/string.util";
import { UploadUtils } from "../utils/upload.util";

@Service()
export class ListingService {

  @InjectRepository(Listing)
  private listingModel: MongoRepository<Listing>;

  @InjectRepository(Company)
  private companyModel: MongoRepository<Company>;

  async create(params: CreateListingRequest, files: Express.Multer.File[], user: User) {
    const { title, from, to, includedPlaces, numberOfNights, mealsIncluded, travelInsurance, visa, hotels, airPortTransfers, itinerary, 
      tags, startDate, endDate, basePrice, variablePrices, airTickets, tourGuide, basePriceSingle, overview, termsAndConditions,
      customExclusions, customInclusions  
    } = params;
    const company = await this.companyModel.findOne({ where: { _id: user.companyId } });
    if (!company) throw new Error('Company not found');
    // create the listing here
    const existingListing = await this.listingModel.findOne({ where: { title } });
    if (existingListing) {
      throw new Error('Listing already exists');
    }
    const newListing = new Listing();
    newListing.title = title;
    newListing.from = from;
    newListing.to = to;
    newListing.includedPlaces = includedPlaces;
    newListing.numberOfNights = Number(numberOfNights);
    if(mealsIncluded?.length) {
      newListing.mealsIncluded = mealsIncluded;
    } else {
      newListing.mealsIncluded = [];
    }
    newListing.travelInsurance = travelInsurance === 'true';
    newListing.startDate = new Date(startDate);
    newListing.endDate = new Date(endDate);
    newListing.listingId = uuidV4();
    if (visa) {
      newListing.visa = visa === 'true';
    }
    if (hotels) {
      newListing.hotels = hotels;
    }
    if (airPortTransfers) {
      newListing.airPortTransfers = airPortTransfers;
    }
    newListing.itinerary = itinerary;
    if (tags) {
      newListing.tags = tags;
    }
    newListing.createdAt = new Date();
    newListing.updatedAt = new Date();
    newListing.basePrice = Number(basePrice);
    newListing.companyId = company._id.toString();
    if (basePriceSingle) {
      newListing.basePriceSingle = Number(basePriceSingle);
    }
    if (variablePrices) {
      newListing.variablePrices = variablePrices;
    }
    if (airTickets) {
      newListing.airTickets = airTickets === 'true';
    }
    if (tourGuide) {
      newListing.tourGuide = tourGuide === 'true';
    }
    if (overview) {
      newListing.overview = overview;
    }
    if(termsAndConditions?.length) {
      newListing.termsAndConditions = termsAndConditions;
    }
    if(customExclusions?.length) {
      newListing.customExclusions = customExclusions;
    }
    if(customInclusions?.length) {
      newListing.customInclusions = customInclusions;
    }
    if (files && files.length > 0) {
      const fileIds = await Promise.all(files.map(async file => {
        const fileName = StringUtil.getUploadFileName(file.originalname, company.name);
        return UploadUtils.uploadFileToBucket(file, 'package-images', fileName)
      }));
      newListing.images = fileIds;
    }
    await this.listingModel.save(newListing);
  }

  async get(params: GetListingRequest) {

    const { from, to, listingType, limit, offset, startDate, endDate, isFeatured, budgetMin, budgetMax, isFlightIncluded, maxNights, minNights, sortKey, sortOrder, isTopPackage, company } = params;

    // const query: FilterQuery<Listing> = {
    //   // start date should be between the start and end date

    //   startDate: {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate)
    //   },
    //   // end date should be between the start and end date
    //   endDate: {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate)
    //   }
    // };

    // if (from) {
    //   const regex = new RegExp(from, 'i');
    //   query['from'] = regex;
    // }
    // if (to) {
    //   const regex = new RegExp(to, 'i');
    //   query['to'] = regex;
    // }
    // query.isActive = true;
    // if (listingType === 'inactive') {
    //   query.isActive = false;
    // }
    // if (listingType === 'all') {
    //   delete query.isActive;
    // }
    // if (isFeatured) {
    //   query.isFeatured = isFeatured;
    // }

    // if (budgetMin) {
    //   query.basePrice = {
    //     $gte: budgetMin
    //   };
    // }

    // if (budgetMax) {
    //   query.basePrice = {
    //     $lte: budgetMax
    //   };
    // }

    // if (isFlightIncluded !== undefined) {
    //   query.isFlightIncluded = isFlightIncluded;
    // }

    // if (maxNights) {
    //   query.numberOfNights = {
    //     $lte: maxNights
    //   };
    // }

    // if (minNights) {
    //   query.numberOfNights = {
    //     $gte: minNights
    //   };
    // }

    const { listings, total } = await this.getFilteredAndSortedListings(
      limit,
      offset,
      startDate,
      endDate,
      from,
      to,
      listingType,
      isFeatured,
      budgetMin,
      budgetMax,
      isFlightIncluded,
      maxNights,
      minNights,
      sortKey,
      sortOrder,
      isTopPackage,
      company
    )
    return {
      listings,
      total
    }

  }

  public calculatePricing(listings: Listing[], startDate: Date, endDate: Date) {
    listings.forEach(listing => {
      const daysForStartFromToday = startDate.getTime() - new Date().getTime();
      const days = Math.floor(daysForStartFromToday / (1000 * 60 * 60 * 24));
      let price = listing.basePrice;
      let variablePriceTotal = 0;
      listing.variablePrices.forEach(variablePrice => {
        if (days >= variablePrice.window) {
          variablePriceTotal = variablePrice.price;
        }
      });
      price += variablePriceTotal;
      listing.price = price;
    });
  }

  async getFilteredAndSortedListings(
    limit: number,
    offset: number,
    startDate?: string,
    endDate?: string,
    from?: string,
    to?: string,
    listingType?: 'active' | 'inactive' | 'all',
    isFeatured?: boolean,
    budgetMin?: number,
    budgetMax?: number,
    isFlightIncluded?: boolean,
    maxNights?: number,
    minNights?: number,
    sortKey?: string,
    sortOrder?: number,
    isTopPackage?: boolean,
    company?: string
  ) {
    const matchStage: any = {};

    const addBufferToDate = (date, bufferDays) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + bufferDays);
      return newDate;
    };

    if (startDate && !endDate) {
      const queryStartDate = new Date(startDate);
      const bufferedStartDate = addBufferToDate(queryStartDate, -5);  // Buffer of -5 days for startDate
      matchStage.startDate = { $gte: bufferedStartDate }; // Apply buffered start date
    }

    if (company) {
      matchStage.companyId = company;
    }

    if (endDate && !startDate) {
      const queryEndDate = new Date(endDate);
      const bufferedEndDate = addBufferToDate(queryEndDate, 5);  // Buffer of +5 days for endDate
      // Also, consider the buffered end date in case the query's endDate is later
      matchStage.endDate = { $lte: bufferedEndDate }; // Apply buffered end date
    }

    if (startDate && endDate) {
      matchStage.$or = [
        {  // Case 1: The package dates are entirely within the query range
          startDate: { $gte: new Date(startDate) },   // Package starts after or equal to query's start date
          endDate: { $lte: new Date(endDate) }        // Package ends before or equal to query's end date
        },
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ];
    }



    if (isTopPackage !== undefined) matchStage.isTopPackage = isTopPackage;

    if (from) matchStage.from = { $regex: from, $options: 'i' };
    if (to) {
      matchStage.$or = [
        { to: { $regex: to, $options: 'i' } },
        { includedPlaces: { $elemMatch: { $regex: to, $options: 'i' } } }
      ];
    }


    if (listingType === 'active') matchStage.isActive = true;
    else if (listingType === 'inactive') matchStage.isActive = false;

    if (isFeatured !== undefined) matchStage.isFeatured = isFeatured;
    if (isFlightIncluded !== undefined) matchStage.isFlightIncluded = isFlightIncluded;

    if (budgetMin !== undefined || budgetMax !== undefined) {
      matchStage.basePrice = {};
      if (budgetMin !== undefined) matchStage.basePrice.$gte = budgetMin;
      if (budgetMax !== undefined) matchStage.basePrice.$lte = budgetMax;
    }

    if (maxNights !== undefined || minNights !== undefined) {
      matchStage.numberOfNights = {};
      if (maxNights !== undefined) matchStage.numberOfNights.$lte = maxNights;
      if (minNights !== undefined) matchStage.numberOfNights.$gte = minNights;
    }

    const pipeline: ObjectLiteral[] = [
      { $match: matchStage },
    ];

    if (sortKey === 'price') {
      pipeline.push(
        {
          $addFields: {
            daysDifference: {
              $dateDiff: {
                startDate: "$startDate",
                endDate: startDate,
                unit: "day"
              }
            }
          }
        },
        {
          $addFields: {
            applicableVariablePrices: {
              $filter: {
                input: "$variablePrices",
                as: "vp",
                cond: { $gte: ["$daysDifference", "$$vp.window"] }
              }
            }
          }
        },
        {
          $addFields: {
            totalVariablePrice: {
              $sum: "$applicableVariablePrices.price"
            }
          }
        },
        {
          $addFields: {
            totalPrice: { $add: ["$basePrice", "$totalVariablePrice"] }
          }
        },
        {
          $sort: { totalPrice: sortOrder || 1 } as any
        }
      );
    } else if (sortKey) {
      pipeline.push({
        $sort: { [sortKey]: sortOrder || 1 } as any
      });
    }

    // Add $skip stage if offset is provided
    if (offset !== undefined) {
      pipeline.push({ $skip: offset });
    }

    // Add $limit stage if limit is provided
    if (limit !== undefined && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    // Execute the aggregation pipeline
    const results = await this.listingModel.aggregate(pipeline).toArray();

    // Get total count (without pagination)
    const totalCount = await this.listingModel.aggregate([
      { $match: matchStage },
      { $count: 'total' }
    ]).toArray();
    console.log(totalCount, "totalCount");
    return {
      listings: results,
      total: totalCount[0] ? totalCount[0]['total'] : 0
    };
  }

  public async getListingById(listingId) {
    return this.listingModel.findOne({
      where: {
        listingId
      }
    })
  }
}