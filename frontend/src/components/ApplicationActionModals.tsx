import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveApplication, rejectApplication } from "../api/applications";
import { Modal } from "./Modal";
import { formatRupiah } from "../utils/format";

export type ActionModalState = {
  isOpen: boolean;
  type: "approve" | "reject" | null;
  id: string | null;
  name: string | null;
  amount: number | string | null;
};

interface Props {
  modalState: ActionModalState;
  setModalState: (state: ActionModalState) => void;
  onSuccess?: () => void;
}

export const ApplicationActionModals = ({
  modalState,
  setModalState,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setModalState({ ...modalState, isOpen: false });
      if (onSuccess) onSuccess();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setModalState({ ...modalState, isOpen: false });
      if (onSuccess) onSuccess();
    },
  });

  const handleApprove = () => {
    if (modalState.id) approveMutation.mutate(modalState.id);
  };

  const handleReject = () => {
    if (modalState.id) rejectMutation.mutate(modalState.id);
  };

  return (
    <>
      <Modal
        isOpen={modalState.isOpen && modalState.type === "approve"}
        title="Setujui Pengajuan?"
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleApprove}
        confirmText="Setujui"
        cancelText="Batal"
        isLoading={approveMutation.isPending}
      >
        <p>
          Apakah Anda yakin ingin menyetujui pengajuan dari{" "}
          <strong>{modalState.name}</strong> sebesar{" "}
          <strong>
            {modalState.amount ? formatRupiah(Number(modalState.amount)) : ""}
          </strong>
          ?
        </p>
      </Modal>

      <Modal
        isOpen={modalState.isOpen && modalState.type === "reject"}
        title="Tolak Pengajuan?"
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleReject}
        confirmText="Tolak"
        cancelText="Batal"
        variant="danger"
        isLoading={rejectMutation.isPending}
      >
        <p>
          Apakah Anda yakin ingin menolak pengajuan dari{" "}
          <strong>{modalState.name}</strong>?
        </p>
      </Modal>
    </>
  );
};
