interface ModalProps {
  modalName: string;
  actionName: string;
  onAction?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
}

function Modal({
  modalName,
  actionName,
  onAction,
  onClose,
  children,
}: ModalProps) {
  return (
    <dialog id={modalName} className="modal">
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <button onClick={onAction} className="btn btn-primary">
            {actionName}
          </button>
          <form method="dialog">
            <button className="btn" onClick={onClose}>
              취소
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default Modal;
