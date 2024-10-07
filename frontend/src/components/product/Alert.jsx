import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export const Alert = ({ isOpen, onClose, onConfirm }) => {
  const { onOpen, onOpenChange } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col">
              <p>¿Estás seguro de que quieres borrar el anuncio?</p>
            </ModalHeader>
            <ModalFooter>
              <Button color="primary" variant="dark" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="danger" onPress={onConfirm}>
                Borrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
