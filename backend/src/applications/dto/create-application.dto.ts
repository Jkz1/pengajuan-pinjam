import { z } from 'zod';

export const createApplicationSchema = z.object({
  customerName: z.string().min(1, 'Nama lengkap harus diisi'),
  applicationType: z.enum(['Sepeda Motor', 'Mobil', 'Multiguna']),
  amount: z.number().positive('Nominal harus lebih dari 0'),
  tenor: z.number().int().positive('Tenor harus lebih dari 0'),
  monthlyIncome: z.number().positive('Pendapatan bulanan harus lebih dari 0'),
  notes: z.string().optional(),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
