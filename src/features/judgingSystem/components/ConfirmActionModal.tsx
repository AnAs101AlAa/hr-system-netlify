import { Button, ButtonTypes, Modal } from "tccd-ui";

export default function ConfirmActionModal<T>({item, isOpen, onClose, title, subtitle, onSubmit, isSubmitting}: {item: T, isOpen: boolean, onClose: () => void, title: string, subtitle: string, onSubmit: (item: T) => void, isSubmitting: boolean}) {

    return (
        <>
            {isOpen && (
            <Modal
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            >
            <div className="p-4">
                <p className="mb-6 text-center">
                {subtitle}
                </p>
                <div className="flex justify-center gap-4">
                <Button
                    type={ButtonTypes.SECONDARY}
                    onClick={onClose}
                    buttonText="Cancel"
                    disabled={isSubmitting}
                />
                <Button
                    type={ButtonTypes.DANGER}
                    onClick={() => onSubmit(item)}
                    loading={isSubmitting}
                    buttonText="Delete"
                />
                </div>
            </div>
            </Modal>
            )}
        </>
    )
}