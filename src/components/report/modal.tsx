import type { FormInstance } from 'antd';
import { Button, Form, Modal } from 'antd';
import type { ReactNode } from 'react';

interface DrawerModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  form: FormInstance;
  onFinish: (values: unknown) => Promise<void>;
}

const DrawerModal: React.FC<DrawerModalProps> = ({
  title,
  visible,
  onClose,
  children,
  form,
  onFinish,
}) => {
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((error) => {
        console.log(`Form err ${error}`);
        // Handle form validation errors if needed
      });
  };
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          Preview
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        {children}
      </Form>
    </Modal>
  );
};

export { DrawerModal };
