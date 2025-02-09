import { Body, Get, JsonController, Post, Req, Res, UploadedFile, UseBefore } from "routing-controllers";
import { LoginRequest, OnboardUserRequest, UserGeneticResponse } from "../models/user";
import { jwtutils } from "../utils/jwt.utils";
import { Request, Response } from "express";
import { CreateSuperAdminRequest } from "../models/user/create-super-admin.request.model";
import { SuccessReponse } from "../models";
import { Inject } from "typedi";
import { UserService } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@JsonController('/user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to onboard a user and company
  @Post('/onboard')
  async create(
    @Body() body: OnboardUserRequest,
  ) {
    const resposne = await this.userService.create(body);
    return resposne 
  }

  @Post('/super-admin')
  async createSuperAdmin(
    @Body() body: CreateSuperAdminRequest
  ) {
    await this.userService.createSuperAdmin(body);
    return new SuccessReponse()
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
    res.cookie('token', token, { httpOnly: true });
    return new UserGeneticResponse(user);
  }

  @Get('/local')
  @UseBefore(AuthMiddleware)
  async verifyAuth(
    @Req() req: Request
  ) {
    const user = req.user;
    const userDetails = await this.userService.verifyAuth(user._id.toString());
    console.log(userDetails, "//////////////////");
    return userDetails;
  }

  @Get('/logout')
  async logout(
    @Res() res: Response
  ) {
    res.clearCookie('token');
    return new SuccessReponse();
  }
}