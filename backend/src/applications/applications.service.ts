import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.provider.js';
import * as schema from '../db/schema.js';
import { eq, desc, count } from 'drizzle-orm';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { BUSINESS_RULES } from './constants/business-rules.js';

type Application = typeof schema.applications.$inferSelect;

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const {
      amount,
      tenor,
      monthlyIncome,
      customerName,
      applicationType,
      notes,
    } = createApplicationDto;

    if (monthlyIncome < BUSINESS_RULES.MIN_MONTHLY_INCOME) {
      throw new BadRequestException('Nasabah belum dapat mengajukan pinjaman');
    }
    if (amount > BUSINESS_RULES.MAX_LOAN_AMOUNT) {
      throw new BadRequestException(
        'Nominal maksimal pengajuan adalah Rp200.000.000',
      );
    }
    if (tenor > BUSINESS_RULES.MAX_TENOR_MONTHS) {
      throw new BadRequestException('Tenor maksimal 24 bulan');
    }

    const result = await this.db
      .select({ value: count(schema.applications.id) })
      .from(schema.applications)
      .where(eq(schema.applications.customerName, customerName))

    const currentApplicationsCount = result[0].value;

    if (
      currentApplicationsCount >= BUSINESS_RULES.MAX_APPLICATIONS_PER_CUSTOMER
    ) {
      throw new BadRequestException('Nasabah maksimal memiliki 3 pengajuan');
    }

    const monthlyPayment = Math.ceil(amount / tenor);

    const [newApplication] = await this.db
      .insert(schema.applications)
      .values({
        customerName,
        applicationType,
        amount: amount.toString(),
        tenor,
        monthlyIncome: monthlyIncome.toString(),
        monthlyPayment: monthlyPayment.toString(),
        notes,
        status: 'PENDING',
      })
      .returning();

    return newApplication;
  }

  async findAll(): Promise<Application[]> {
    return this.db
      .select()
      .from(schema.applications)
      .orderBy(desc(schema.applications.createdAt));
  }

  async findOne(id: string): Promise<Application> {
    const [application] = await this.db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.id, id));

    if (!application) {
      throw new NotFoundException('Pengajuan tidak ditemukan');
    }
    return application;
  }

  async approve(id: string): Promise<Application> {
    return this.updateStatus(id, 'APPROVED');
  }

  async reject(id: string): Promise<Application> {
    return this.updateStatus(id, 'REJECTED');
  }

  private async updateStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
  ): Promise<Application> {
    const application = await this.findOne(id);
    if (application.status !== 'PENDING') {
      throw new BadRequestException(
        `Pengajuan sudah berstatus ${application.status}`,
      );
    }

    const [updated] = await this.db
      .update(schema.applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.applications.id, id))
      .returning();

    return updated;
  }
}
