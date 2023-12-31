import React from 'react';
import styled from 'styled-components';
import { signout } from '../../apis/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeLocalStorageToken } from '../../utils/LocalStorage';
import { toast } from 'react-toastify';
interface ModalProps {
  HandleModal: () => void;
}
const Modal: React.FC<ModalProps> = ({ HandleModal }) => {
  const navigate = useNavigate();
  const HandleSignOut = async () => {
    try {
      const response = await signout();
      if (response.status === 200) {
        toast.success('성공적으로 탈퇴되었습니다', {
          theme: 'dark',
          position: toast.POSITION.TOP_CENTER,
          onClose: () => {
            removeLocalStorageToken();
            navigate('/');
          },
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          toast.warn('502 Bad GateWay !', {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          console.log(err);
          toast.error('알수없는 에러 발생!', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    }
  };
  return (
    <ModalLayout>
      <ModalContext>
        <Title>정말로 탈퇴하시겠습니까?</Title>
        <ButtonLayer>
          <ModalButton $iscolor={true} onClick={HandleSignOut}>
            예
          </ModalButton>
          <ModalButton $iscolor={false} onClick={HandleModal}>
            아니오
          </ModalButton>
        </ButtonLayer>
      </ModalContext>
    </ModalLayout>
  );
};
export default Modal;

const ModalLayout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContext = styled.div`
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  color: #000;
  font-size: 32px;
  text-align: center;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e4e4;
  margin-bottom: 20px;
`;
const ButtonLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
const ModalButton = styled.button<{ $iscolor: boolean }>`
  width: 200px;
  height: 58px;
  border-radius: 35px;
  background: ${props => (props.$iscolor ? '#fedd33' : '#D9D9D9')};
  color: #000;
  border: none;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%; /* 32.4px */
  letter-spacing: -0.24px;
  &:hover {
    transform: scale(1.03);
    cursor: pointer;
  }
`;
