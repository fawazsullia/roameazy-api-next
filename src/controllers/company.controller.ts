import { Get, JsonController, Param } from "routing-controllers";
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
}