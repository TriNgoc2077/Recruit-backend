import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subcribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  @Cron('0 0 0 * * 0') //0h 0m 0s, * day of month, * months, 0 day of week = sunday
  async handleTestEmail() {
    const jobs = [
      {
        name: 'Fresher react',
        company: 'ABC company',
        salary: '5000',
        skills: ['React', 'Nodejs'],
      },
      {
        name: 'Fresher react1',
        company: 'ABC company1',
        salary: '5000',
        skills: ['React1', 'Nodejs1'],
      },
    ];
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });

      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' vnd',
            skills: item.skills,
          };
        });

        await this.mailerService.sendMail({
          to: 'caotringoc11@gmail.com',
          from: 'Support Team caonguyentringoc@gmail.com',
          subject: 'Welcome to Nice App',
          template: 'job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
