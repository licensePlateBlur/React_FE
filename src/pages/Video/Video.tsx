import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import VideoCounter from './hook/VideoCounter';
import FindXY from './hook/FindXY';
import FindClass from '../../hook/FindClass';
import { ReactComponent as DragImage } from '../../svg/upload-box-group.svg';
import { ReactComponent as Icon } from '../../svg/icon.svg';
import { previewvideo, videoupload } from '../../apis/video';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getid } from '../../store/video';
import DownButton from '../../component/Button';
import { VideoData } from '../../interface/VideoData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLocalStorageToken, removeLocalStorageToken } from '../../utils/LocalStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckModel, modelOptions } from '../../utils/CheckModel';
import axios from 'axios';
function Video() {
  const [datas, setDatas] = useState<VideoData[]>([]);
  const [label, setLabel] = useState<number[]>([0, 0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [drop, setDrop] = useState<boolean>(false);
  const [model, setModel] = useState<string>('얼굴');
  const id = useSelector((store: RootState) => store.video.id);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  //ref
  const inputRef = useRef<HTMLLabelElement>(null);
  const changeRef = useRef<HTMLInputElement>(null);
  function HandleCancel() {
    window.location.reload();
  }
  const HandleModel = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setModel(e.target.value);
  };
  const PreviewHandler = async () => {
    const video = document.getElementById('video') as HTMLVideoElement;
    const source = document.getElementById('source') as HTMLVideoElement;
    try {
      const res = await previewvideo(id);
      console.log(res);
      const videourl = URL.createObjectURL(res.data);
      source.src = videourl;
      video.load();
      video.play();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const input = inputRef.current;
    const changeinput = changeRef.current;
    //input change listener function
    function InputOnchange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        if (target.files.length > 0) {
          if (getLocalStorageToken()) {
            DropVideo(target.files[0]);
          } else {
            alert('로그인 권한이 없습니다');
            navigate('/signin', { state: { from: location } });
          }
        }
      }
    }
    function handleDragOver(event: DragEvent) {
      event.preventDefault();
      if (input) input.style.transform = 'scale(1.03)';
    }
    function handleDragLeave(event: DragEvent) {
      event.preventDefault();
      if (input) input.style.transform = 'scale(1.0)';
    }
    function handleDrop(event: DragEvent) {
      if (input) input.style.transform = 'scale(1.0)';
      setShow(false);
      event.preventDefault();
      if (event.dataTransfer) {
        console.log(event.dataTransfer.files[0]);
        const f = event.dataTransfer.files[0];
        if (getLocalStorageToken()) {
          DropVideo(f);
        } else {
          alert('로그인 권한이 없습니다');
          navigate('/signin', { state: { from: location } });
        }
      }
    }
    const DropVideo = async (f: File) => {
      setDrop(true);
      setLoading(true);
      const preload = document.querySelectorAll<HTMLElement>('.preload');
      preload.forEach(preload => (preload.style.display = 'none'));
      const formData = new FormData();
      const modelNumber = CheckModel(model);
      formData.append('video', f);
      formData.append('model', modelNumber);
      try {
        const response = await videoupload(formData);
        console.log(response);
        if (response.data === '첨부한 파일이 동영상 형식이 맞는지 확인해주세요.') {
          setDrop(false);
          toast.warn('동영상 형식을 확인해 주세요', {
            position: toast.POSITION.TOP_CENTER,
            onClose: () => window.location.reload(),
          });
        } else {
          setDatas(response.data[3]);
          dispatch(getid(response.data[0].video_id));
          const copylabel = VideoCounter(response.data[3]);
          setLabel(copylabel);
          setShow(true);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            toast.warn('토큰이 만료되었습니다. 다시 로그인 해주세요', {
              position: toast.POSITION.TOP_CENTER,
              onClose: () => {
                removeLocalStorageToken();
                navigate('/signin');
              },
            });
          } else if (err.code === 'ERR_NETWORK') {
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
      } finally {
        setLoading(false);
        setTimeout(() => {
          setDrop(false);
        }, 1800);
      }
    };
    //리스너생성
    if (input) {
      input.addEventListener('dragover', handleDragOver); //이게 있어야 drop 이 작동됨
      input.addEventListener('dragleave', handleDragLeave);
      input.addEventListener('drop', handleDrop);
    }
    if (changeinput) changeinput.addEventListener('change', InputOnchange);
    return () => {
      //리스너삭제
      if (input) {
        input.removeEventListener('dragover', handleDragOver);
        input.addEventListener('dragleave', handleDragLeave);
        input.removeEventListener('drop', handleDrop);
      }
      if (changeinput) changeinput.removeEventListener('change', InputOnchange);
    };
  }, [dispatch, id, location, navigate, model]);
  return (
    <Layer>
      {drop ? (
        loading ? (
          <DownButton message="로딩중" />
        ) : (
          <DownButton message="로딩완료" isfadeout={true} />
        )
      ) : null}
      <UploadBox>
        <TitleLayer>
          <BoldText1>동영상을 업로드 해주세요</BoldText1>
          <ModelLayer>
            <ModelLabel>모델 : </ModelLabel>
            <ModelSelect value={model} onChange={HandleModel}>
              {modelOptions.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </ModelSelect>
          </ModelLayer>
        </TitleLayer>
        <form>
          <Input ref={changeRef} type="file" id="input-file-upload" multiple={false} />
          <Label ref={inputRef} htmlFor="input-file-upload">
            <DragImage />
          </Label>
        </form>
      </UploadBox>
      <DisabledBox>
        <ButtonLayer>
          <BoldText>블러처리된 영상 보기</BoldText>
          {!loading && id !== 0 && (
            <>
              <CancelBtn onClick={HandleCancel}>취소</CancelBtn>
              <DownloadBtn onClick={PreviewHandler}>
                <Icon />
                영상보기
              </DownloadBtn>
            </>
          )}
        </ButtonLayer>
        {!loading ? (
          <VideoBox controls id="video" $isflex={show}>
            <source id="source" src=""></source>
          </VideoBox>
        ) : null}
        <DisabledRectangle className="preload">동영상을 먼저 업로드해주세요.</DisabledRectangle>
        {loading && <DisabledRectangle>로딩중 입니다. 기다려주세요</DisabledRectangle>}
      </DisabledBox>
      <DisabledInfoBox>
        <BoldText1>탐색된 좌표</BoldText1>
        <DisabledInfoRectangle className="preload">
          동영상을 먼저 업로드해주세요.
        </DisabledInfoRectangle>
        {loading && <DisabledInfoRectangle>로딩중 입니다. 기다려주세요</DisabledInfoRectangle>}
        {!loading && id !== 0 && <FindXY data={datas} />}
      </DisabledInfoBox>
      <DisabledInfoBox>
        <BoldText1>탐색된 클래스</BoldText1>
        <DisabledInfoRectangle className="preload">
          동영상을 먼저 업로드해주세요.
        </DisabledInfoRectangle>
        {loading && <DisabledInfoRectangle>로딩중 입니다. 기다려주세요</DisabledInfoRectangle>}
        {!loading && id !== 0 && <FindClass label={label} />}
      </DisabledInfoBox>
    </Layer>
  );
}
export default Video;

const Layer = styled.div`
  width: 80%;
  margin: 0 197px;
  display: flex;
  flex-wrap: wrap;
  gap: 27px;
  position: relative;
`;
const VideoBox = styled.video<{ $isflex: boolean }>`
  display: ${props => (props.$isflex ? 'flex' : 'none')};
  width: 752px;
  height: 398px;
  max-width: 752px;
  max-height: 398px;
`;

const UploadBox = styled.div`
  width: 752px;
  height: 465px;
  margin-top: 111px;
`;
const BoldText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.32px;
`;
const BoldText1 = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.32px;
  margin-bottom: 31px;
`;
const Input = styled.input`
  display: none;
`;
const Label = styled.label`
  width: 100%;
  height: 398px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DisabledBox = styled.div`
  margin-top: 111px;
  width: 752px;
  height: 465px;
`;
const DisabledRectangle = styled.div`
  width: 100%;
  height: 398px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #f9f9f9;
  color: #808080;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 32.4px */
  letter-spacing: -0.24px;
`;
const CancelBtn = styled.button`
  width: 96px;
  height: 40px;
  border-radius: 35px;
  background: #f3f3f3;
  color: #606060;
  text-align: center;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  border: none;
`;
const ButtonLayer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 31px;
`;
const DisabledInfoBox = styled.div`
  margin-top: 111px;
  width: 752px;
  height: 310px;
`;
const DisabledInfoRectangle = styled.div`
  width: 100%;
  height: 245px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #f9f9f9;
  color: #808080;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 32.4px */
  letter-spacing: -0.24px;
`;
const DownloadBtn = styled.button`
  width: 158px;
  height: 40px;
  border-radius: 35px;
  background: #000;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0px;
`;
const TitleLayer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ModelLabel = styled.label`
  font-size: 21px;
  background: #f3f3f3;
  border-radius: 15px;
  padding: 10px;
  border: none;
`;

const ModelLayer = styled.div`
  display: flex;
  gap: 5px;
  color: #000;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.32px;
  margin-left: auto;
`;

const ModelSelect = styled.select`
  color: #000;
  font-family: Pretendard;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.32px;
  background: #fffbef;
  border-radius: 15px;
  border: 1px dashed #fedd33;
  padding: 10px;
`;
