import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import { AxiosError } from "axios";

import { createApplication } from "../api/applications";

const applicationSchema = z.object({
  customerName: z.string().min(1, "Nama lengkap harus diisi"),
  applicationType: z.enum(
    ["Sepeda Motor", "Mobil", "Multiguna"],
    "Tipe pengajuan harus dipilih",
  ),
  amount: z
    .number({
      message: "Nominal harus diisi",
    })
    .min(1, "Nominal harus lebih dari 0")
    .max(200000000, "Nominal maksimal Rp200.000.000"),
  tenor: z
    .number({
      message: "Tenor harus diisi",
    })
    .min(1, "Tenor harus lebih dari 0")
    .max(24, "Tenor maksimal 24 bulan"),
  monthlyIncome: z
    .number({
      message: "Pendapatan bulanan harus diisi",
    })
    .min(1000000, "Nasabah belum dapat mengajukan pinjaman"),
  notes: z.string().min(1, "Catatan harus diisi"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const ApplicationCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [apiError, setApiError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createApplication,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      navigate({
        to: "/applications",
      });
    },

    onError: (
      error: AxiosError<{
        message: string | string[];
      }>,
    ) => {
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setApiError(message.join(", "));
      } else {
        setApiError(message || "Terjadi kesalahan saat menyimpan pengajuan.");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      customerName: "",
      applicationType: "Sepeda Motor" as ApplicationFormValues["applicationType"],
      amount: undefined as number | undefined,
      tenor: undefined as number | undefined,
      monthlyIncome: undefined as number | undefined,
      notes: "",
    },

    onSubmit: async ({ value }) => {
      setApiError(null);

      const result = applicationSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      await mutation.mutateAsync(result.data);
    },
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/applications"
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          &larr; Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Tambah Pengajuan Baru
        </h2>
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="text-sm">{apiError}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="customerName"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.customerName.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.customerName.safeParse(value).error
                      ?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="applicationType"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.applicationType.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.applicationType.safeParse(value)
                      .error?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipe Pengajuan
                </label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target
                        .value as ApplicationFormValues["applicationType"],
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="Sepeda Motor">Sepeda Motor</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Multiguna">Multiguna</option>
                </select>

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.amount.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.amount.safeParse(value).error
                      ?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Nominal Pengajuan (Rp)
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rp
                  </span>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="numeric"
                    value={
                      field.state.value
                        ? Number(field.state.value).toLocaleString("id-ID")
                        : ""
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");

                      field.handleChange(
                        rawValue === "" ? undefined : Number(rawValue),
                      );
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="tenor"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.tenor.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.tenor.safeParse(value).error
                      ?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Tenor (Bulan)
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Maksimal 24 bulan"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="monthlyIncome"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.monthlyIncome.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.monthlyIncome.safeParse(value).error
                      ?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Pendapatan Bulanan (Rp)
                </label>

                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rp
                  </span>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="numeric"
                    value={
                      field.state.value
                        ? Number(field.state.value).toLocaleString("id-ID")
                        : ""
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");

                      field.handleChange(
                        rawValue === "" ? undefined : Number(rawValue),
                      );
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="notes"
            validators={{
              onChange: ({ value }) =>
                applicationSchema.shape.notes.safeParse(value).success
                  ? undefined
                  : applicationSchema.shape.notes.safeParse(value).error
                      ?.issues[0]?.message,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Catatan
                </label>

                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={mutation.isPending || !form.state.canSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {mutation.isPending ? "Menyimpan..." : "Simpan Pengajuan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
