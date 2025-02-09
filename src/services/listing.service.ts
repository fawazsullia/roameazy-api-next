import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { v4 as uuidV4 } from "uuid"
import { Company, CompanyDetail, Listing, User } from "../orm/entities";
import { MongoRepository, ObjectLiteral } from "typeorm";
import { CreateListingRequest, GetListingRequest, UpdateListingRequest } from "../models";
import { StringUtil } from "../utils/string.util";
import { UploadUtils } from "../utils/upload.util";
import { ObjectId } from "mongodb";

@Service()
export class ListingService {

  @InjectRepository(Listing)
  private listingModel: MongoRepository<Listing>;

  @InjectRepository(Company)
  private companyModel: MongoRepository<Company>;

  @InjectRepository(CompanyDetail)
  private companyDetailModel: MongoRepository<CompanyDetail>;

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
    if (mealsIncluded?.length) {
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
    if (termsAndConditions?.length) {
      newListing.termsAndConditions = termsAndConditions;
    }
    if (customExclusions?.length) {
      newListing.customExclusions = customExclusions;
    }
    if (customInclusions?.length) {
      newListing.customInclusions = customInclusions;
    }
    if (files && files.length > 0) {
      const fileIds = await Promise.all(files.map(async file => {
        const formattedOriginalName = StringUtil.getFormattedFileName(file.originalname);
        const fileName = StringUtil.getUploadFileName(formattedOriginalName, company.name);
        return UploadUtils.uploadFileToBucket(file, 'package-images', fileName)
      }));
      newListing.images = fileIds;
    }
    await this.listingModel.save(newListing);
  }

  async get(params: GetListingRequest) {

    const { from, to, listingType, limit, offset, startDate, endDate, isFeatured, budgetMin, budgetMax, isFlightIncluded, maxNights, minNights, sortKey, sortOrder, isTopPackage, company, includeCompany } = params;

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
    );
    const companyIds = listings.map(listing => listing.companyId);
    const companyDetails = await this.companyDetailModel.find({ where: { companyId: { $in: companyIds } } });
    const companyDetailsMap = companyDetails.reduce((acc: { [key: string]: string | undefined }, company) => {
      acc[company.companyId.toString()] = company.logo
      return acc;
    }, {});
    const formattedListings: (Listing & { logo: string | undefined; company?: Partial<Company> })[] = listings.map(listing => {
      return {
        ...listing,
        logo: companyDetailsMap[listing.companyId],

      }
    }
    );
    if (includeCompany) {
      const companies = await this.companyModel.find({ where: { _id: { $in: companyIds.map((id) => new ObjectId(id)) } } });
      const companiesMap = companies.reduce((acc: { [key: string]: Partial<Company> }, company) => {
        acc[company._id.toString()] = {
          name: company.name,
          _id: company._id
        }
        return acc;
      }, {});
      formattedListings.forEach(listing => {
        listing.company = companiesMap[listing.companyId]
      });
    }
    return {
      listings: formattedListings,
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

    matchStage.$and = [{
      _id: { $exists: true }
    }]

    if (startDate && endDate) {
      const dateQuery = {
        $or: [
          {  // Case 1: The package dates are entirely within the query range
            startDate: { $gte: new Date(startDate) },   // Package starts after or equal to query's start date
            endDate: { $lte: new Date(endDate) }        // Package ends before or equal to query's end date
          },
          {
            startDate: { $lte: new Date(startDate) },
            endDate: { $gte: new Date(endDate) }
          }
        ]
      }
      matchStage.$and.push(dateQuery);
    }


    if (isTopPackage !== undefined) matchStage.isTopPackage = isTopPackage;

    if (from) matchStage.from = { $regex: from, $options: 'i' };
    if (to) {
      const toMatchStage = {
        $or: [
          { to: { $regex: to, $options: 'i' } },
          { includedPlaces: { $elemMatch: { $regex: to, $options: 'i' } } }
        ]
      };
      matchStage.$and.push(toMatchStage);
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

    console.log(matchStage, "matchStage-------------->");

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
      })
    } else {
      pipeline.unshift({ $sample: { size: limit || 10 } });
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

  public async updateListing(listingId: string, updateListingInfo: UpdateListingRequest) {
    const {
      title,
      isVerified,
      includedPlaces,
      mealsIncluded,
      travelInsurance,
      visa,
      hotels,
      airTickets,
      tourGuide,
      airPortTransfers,
      itinerary,
      tags,
      startDate,
      endDate,
      isActive,
      isFeatured,
      basePrice,
      basePriceSingle,
      images,
      overview,
      isTopPackage,
      termsAndConditions,
      customInclusions,
      customExclusions,
    } = updateListingInfo;

    const listing = await this.listingModel.findOne({ where: { listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }
    if (title) {
      listing.title = title;
    }
    if (isVerified !== undefined) {
      listing.isVerified = isVerified;
    }
    if (includedPlaces) {
      listing.includedPlaces = includedPlaces;
    }
    if (mealsIncluded) {
      listing.mealsIncluded = mealsIncluded;
    }
    if (travelInsurance !== undefined) {
      listing.travelInsurance = travelInsurance;
    }
    if (visa !== undefined) {
      listing.visa = visa;
    }
    if (hotels) {
      listing.hotels = hotels;
    }
    if (airTickets !== undefined) {
      listing.airTickets = airTickets;
    }
    if (tourGuide !== undefined) {
      listing.tourGuide = tourGuide;
    }
    if (airPortTransfers) {
      listing.airPortTransfers = airPortTransfers;
    }
    if (itinerary) {
      listing.itinerary = itinerary;
    }
    if (tags) {
      listing.tags = tags;
    }
    if (startDate) {
      listing.startDate = new Date(startDate);
    }
    if (endDate) {
      listing.endDate = new Date(endDate);
    }
    if (isActive !== undefined) {
      listing.isActive = isActive;
    }
    if (isFeatured !== undefined) {
      listing.isFeatured = isFeatured;
    }
    if (basePrice) {
      listing.basePrice = basePrice;
    }
    if (basePriceSingle) {
      listing.basePriceSingle = basePriceSingle;
    }
    if (images) {
      listing.images = images;
    }
    if (overview) {
      listing.overview = overview;
    }
    if (isTopPackage !== undefined) {
      listing.isTopPackage = isTopPackage;
    }
    if (termsAndConditions) {
      listing.termsAndConditions = termsAndConditions;
    }
    if (customInclusions) {
      listing.customInclusions = customInclusions;
    }
    if (customExclusions) {
      listing.customExclusions = customExclusions;
    }
    await this.listingModel.save(listing);
  }
}