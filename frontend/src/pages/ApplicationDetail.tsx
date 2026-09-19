import { useQuery } from "@tanstack/react-query";
import { getApplication } from "../api/applications";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { formatRupiah, formatDate } from "../utils/format";
import { useState } from "react";
import { ApplicationActionModals } from "../components/ApplicationActionModals";
import type { ActionModalState } from "../components/ApplicationActionModals";

export const ApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id: string };
  const [modalState, setModalState] = useState<ActionModalState>({
    isOpen: false,
    type: null,
    id: null,
    name: null,
    amount: null,
  });
  const {
    data: app,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Memuat data pengajuan...
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat data pengajuan.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/applications"
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          &larr; Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Detail Pengajuan
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Informasi lengkap nasabah dan pembiayaan.
            </p>
          </div>

          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${app.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : app.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {app.status === "APPROVED"
              ? "Disetujui"
              : app.status === "REJECTED"
                ? "Ditolak"
                : "Pending"}
          </span>
        </div>

        {/* Detail */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Nama Lengkap
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {app.customerName}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Tipe Pengajuan
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {app.applicationType}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Nominal Pengajuan
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatRupiah(app.amount)}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tenor</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {app.tenor} Bulan
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Pendapatan Bulanan
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatRupiah(app.monthlyIncome)}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-bold text-gray-700">
                Cicilan per Bulan
              </dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                {formatRupiah(app.monthlyPayment)}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Tanggal Pengajuan
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(app.createdAt)}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Catatan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {app.notes || "-"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        {app.status === "PENDING" && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    type: "approve",
                    id: app.id,
                    name: app.customerName,
                    amount: app.amount,
                  })
                }
                className="inline-flex items-center rounded-md border border-green-600 bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
              >
                Setujui
              </button>

              <button
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    type: "reject",
                    id: app.id,
                    name: app.customerName,
                    amount: app.amount,
                  })
                }
                className="inline-flex items-center rounded-md border border-red-600 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50"
              >
                Tolak
              </button>
            </div>
          </div>
        )}
      </div>
      <ApplicationActionModals
        modalState={modalState}
        setModalState={setModalState}
        onSuccess={() => navigate({ to: "/applications" })}
      />
    </div>
  );
};
