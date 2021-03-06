import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "@core/dto/login-user.dto";
import { AuthResponseDto } from "@core/dto/auth-response.dto";
import { ResetPasswordDto } from "@core/dto/reset-password.dto";
import { MoreThan } from "typeorm";
import { MailService } from "../shared/services/mail.service";

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(private readonly _userService: UserService,
              private readonly _jwtService: JwtService,
              private _mailService: MailService) {
  }

  async login(user: LoginUserDto): Promise<AuthResponseDto> {
    const userToReturn = await this._validateUser(user);
    if (userToReturn) {
      return {
        chatbotToken: this._jwtService.sign(JSON.parse(JSON.stringify(userToReturn))),
        user: userToReturn
      };
    }
    return null;
  }

  async sendEmailPasswordToken(email: string) {
    const userWithoutPassword = await this._userService.findOne(email);
    if (!userWithoutPassword) {
      return;
    }
    const userUpdated = await this._userService.setPasswordResetToken(userWithoutPassword);

    await this._mailService.sendEmail(userUpdated.email,
      'Fabrique à Chatbots - Réinitialisation de mot de passe',
      'forgot-password',
      {  // Data to be sent to template engine.
        firstName: userUpdated.first_name,
        url: `${process.env.HOST_URL}/backoffice/auth/reset-password?token=${userUpdated.reset_password_token}`
      })
      .then(() => {
      });
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const userWithoutPassword = await this._userService.findOneWithParam({
      reset_password_token: resetPassword.token,
      reset_password_expires: MoreThan(new Date())
    });
    if (!userWithoutPassword) {
      throw new HttpException('Cet utilisateur n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const hashPassword = bcrypt.hashSync(resetPassword.password, this.saltRounds);
    const valuesToUpdate = {
      password: hashPassword,
      reset_password_token: undefined,
      reset_password_expires: undefined
    };
    const userUpdated = await this._userService.findAndUpdate(userWithoutPassword.email, valuesToUpdate);

    await this._mailService.sendEmail(userUpdated.email,
      'Fabrique à Chatbots - Mot de passe modifié',
      'reset-password',
      {  // Data to be sent to template engine.
        firstName: userUpdated.first_name,
        url: `${process.env.HOST_URL}/backoffice/auth/login`
      })
      .then(() => {
      });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private async _validateUser(user: LoginUserDto): Promise<any> {
    const userToReturn = await this._userService.findOne(user.email, true);
    if (userToReturn && bcrypt.compareSync(user.password, userToReturn.password)) {
      const {password, ...result} = userToReturn;
      return result;
    }
    throw new HttpException('Mauvais identifiant ou mot de passe.',
      HttpStatus.UNAUTHORIZED);
  }
}
