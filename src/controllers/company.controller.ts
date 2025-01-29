import { Get, JsonController, Param, QueryParam } from "routing-controllers";
import { Inject } from "typedi";
import { CompanyService } from "../services/company.service";

@JsonController("/company")
export class CompanyController {
  // Add your endpoints here

  @Inject()
  private companyService: CompanyService;

  @Get("/:id")
  public async getCompanyById(
    @Param("id") id: string
  ) {
    return this.companyService.getCompanyById(id);
  }

  @Get("/")
  public async getCompanies(
    @QueryParam("limit", { required: false }) limit: number,
    @QueryParam("offset", { required: false }) offset: number,
    @QueryParam("getDetail", { required: false }) getDetail: boolean
  ) {
    return this.companyService.getCompanies(getDetail, limit, offset);
  }

  @Get("/token/:token")
  public async getCompanyByToken(
    @Param("token") token: string
  ) {
    return this.companyService.getCompanyByToken(token);
  }
}