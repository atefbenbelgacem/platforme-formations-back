import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { UsersService } from "src/components/users/users.service";

@Injectable()
export class NodeMailerService {
    private user: string = 'proxymProjectTest@outlook.com'
    private password: string = 'projectTest123'
    private transporter: any

    constructor(private readonly userService: UsersService) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.user, // generated ethereal user
                pass: this.password, // generated ethereal password
            },
        });
    }

    async sendEmail(usersIds: string[], msg: string) {

        let destinations: string[] = []
        const users = await this.userService.findUsersByIds(usersIds)
        users.map(user => {
            destinations.push(user.email)
        })

        try {
            let info = await this.transporter.sendMail({
                from: this.user, // sender address
                to: destinations, // list of receivers
                subject: "Proxym-IT Trainings Platform", // Subject line
                text: msg, // plain text body
            });
            console.log("Message sent: %s", info.messageId)
        } catch (error) {
            throw new InternalServerErrorException('node mailer could not send the emails with the message : ' + msg, error)
        }
    }



}