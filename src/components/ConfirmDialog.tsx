import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

type Props = {
  visible: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  visible,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: Props) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      {description ? (
        <Dialog.Content>
          <Text>{description}</Text>
        </Dialog.Content>
      ) : null}
      <Dialog.Actions>
        <Button onPress={onCancel}>{cancelLabel}</Button>
        <Button onPress={onConfirm}>{confirmLabel}</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ConfirmDialog;
