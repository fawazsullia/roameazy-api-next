import { Body, JsonController, Post, Res, UploadedFile } from "routing-controllers";
import { LoginRequest, OnboardUserRequest, UserGeneticResponse } from "../models/user";
import { jwtutils } from "../utils/jwt.utils";
import { Response } from "express";
import { CreateSuperAdminRequest } from "../models/user/create-super-admin.request.model";
import { SuccessReponse } from "../models";
import { Inject } from "typedi";
import { UserService } from "../services";

@JsonController('/user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to onboard a user and company
  @Post('/onboard')
  async create(
    @Body() body: OnboardUserRequest,
    @UploadedFile('license') license: Express.Multer.File
  ) {
    await this.userService.create(body, license);
    return new SuccessReponse()
  }

  @Post('/super-admin')
  async createSuperAdmin(
    @Body() body: CreateSuperAdminRequest
  ) {
    return this.userService.createSuperAdmin(body);
  }

  @Post('/login')
  async login(
    @Body() body: LoginRequest,
    @Res() res: Response
  ) {
    const user = await this.userService.login(body);
    const loggedInUser = {
      _id: user._id,
      name: user.name,
      role: user.role
    }
    const token = await jwtutils.sign(loggedInUser);
    console.log('token===================>', token);
    res.cookie('token', token, { httpOnly: true });
    return new UserGeneticResponse(user);
  }
}