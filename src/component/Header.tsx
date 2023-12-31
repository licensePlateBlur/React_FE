import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getLocalStorageToken, removeLocalStorageToken } from '../utils/LocalStorage';
function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeLocalStorageToken();
    navigate('/photo');
  };
  return (
    <HeaderLayer>
      <NavLink className="Logo" to="/">
        Groot
      </NavLink>
      <ul>
        <NavLink to="/photo">
          <li>사진</li>
        </NavLink>
        <NavLink to="/video">
          <li>동영상</li>
        </NavLink>
        <NavLink to="/realtime">
          <li>실시간영상</li>
        </NavLink>
        <NavLink to="/gallery">
          <li>갤러리</li>
        </NavLink>
      </ul>

      <SubTitle>
        {getLocalStorageToken() ? (
          <>
            <Link to="/mypage">
              <Login>마이페이지</Login>
            </Link>
            <Signup onClick={handleLogout}>로그아웃</Signup>
          </>
        ) : (
          <>
            <Link to="/signin">
              <Login>로그인</Login>
            </Link>
            <Link to="/signup">
              <Signup>회원가입</Signup>
            </Link>
          </>
        )}
      </SubTitle>
    </HeaderLayer>
  );
}

export default React.memo(Header);

const HeaderLayer = styled.div`
  width: 100%;
  height: 116px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const SubTitle = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 50px;
  margin-left: auto;
  margin-right: 53.25px;
`;

const Login = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 32.4px */
  letter-spacing: -0.24px;
`;
const Signup = styled.div`
  width: 141px;
  height: 58px;
  border-radius: 35px;
  background: #fedd33;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%; /* 32.4px */
  letter-spacing: -0.24px;
`;
