import { Body, Controller, Inject, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { LoginRequest, OnboardUserRequest, SuccessReponse, UserGeneticResponse } from "src/models";
import { CreateSuperAdminRequest } from "src/models/user/create-super-admin.request.model";
import { UserService } from "src/services";
import { jwtutils } from "src/utils/jwt.utils";

@Controller('user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to onboard a user and company
  @Post('onboard')
  @UseInterceptors(FileInterceptor('license'))
  async create(
    @Body() body: OnboardUserRequest,
    @UploadedFile() license: Express.Multer.File
  ) {
    await this.userService.create(body, license);
    return new SuccessReponse()
  }

  @Post('super-admin')
  async createSuperAdmin(
    @Body() body: CreateSuperAdminRequest
  ) {
    return this.userService.createSuperAdmin(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.login(body, res);
    const loggedInUser = {
      _id: user._id,
      name: user.name,
      role: user.role
    }
    const token = jwtutils.sign(loggedInUser);
    res.cookie('token', token, { httpOnly: true });
    return new UserGeneticResponse(user);
  }
}