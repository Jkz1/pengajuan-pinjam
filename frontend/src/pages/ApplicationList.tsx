import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applications";
import { Link } from "@tanstack/react-router";
import { formatRupiah, formatDate } from "../utils/format";
import { ApplicationActionModals } from "../components/ApplicationActionModals";
import type { ActionModalState } from "../components/ApplicationActionModals";

export const ApplicationList = () => {
  const [modalState, setModalState] = useState<ActionModalState>({
    isOpen: false,
    type: null,
    id: null,
    name: null,
    amount: null,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Memuat data pengajuan...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat data pengajuan.
      </div>
    );

  const applications = data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengajuan</h1>
        <Link
          to="/applications/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
        >
          + Tambah Pengajuan
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 mb-4">Belum ada pengajuan.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nasabah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal & Tenor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cicilan/Bulan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {app.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(app.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.applicationType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatRupiah(app.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.tenor} Bulan
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatRupiah(app.monthlyPayment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === "APPROVED"
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2 justify-center">
                      <Link
                        to="/applications/$id"
                        params={{ id: app.id }}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                      >
                        Detail
                      </Link>

                      {app.status === "PENDING" && (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ApplicationActionModals
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};
