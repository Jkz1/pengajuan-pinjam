import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const applicationTypeEnum = pgEnum('application_type', [
  'Sepeda Motor',
  'Mobil',
  'Multiguna',
]);
export const statusEnum = pgEnum('status', ['PENDING', 'APPROVED', 'REJECTED']);

export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  applicationType: applicationTypeEnum('application_type').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  tenor: integer('tenor').notNull(),
  monthlyIncome: numeric('monthly_income', {
    precision: 15,
    scale: 2,
  }).notNull(),
  monthlyPayment: numeric('monthly_payment', {
    precision: 15,
    scale: 2,
  }).notNull(),
  notes: text('notes'),
  status: statusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
