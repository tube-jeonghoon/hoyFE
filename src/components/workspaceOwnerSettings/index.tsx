import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import defaultUser from '../../../public/img/defaultWorkspace.svg';
import cancel from '../../../public/img/cancel.svg';
import plus from '../../../public/img/plus.svg';
import ownerIcon from '../../../public/img/owner.svg';
import verticalSetting from '../../../public/img/verticalSetting.svg';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import { isInviteMemberModalState } from '@/store/atom/modalStatus';
import InviteMemberModal from '../modal/inviteMemberModal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import pica from 'pica';
import UserSettingsModal from '../modal/userSettingsModal';

interface WorkspaceUserList {
  userId: number;
  nickname: string;
  imgUrl: string;
  flag?: boolean;
  admin: boolean;
}

const WorkspaceOwnerSettings = forwardRef((props, ref) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null); // 상태 에러 메시지
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const workspaceNameRef = useRef<HTMLInputElement | null>(null);
  const [workspaceUserList, setWorkspaceUserList] = useState<
    WorkspaceUserList[]
  >([]);

  const [isUserSettingsModalVisible, setIsUserSettingsModalVisible] = useState<{
    [key: number]: boolean;
  }>({});

  // 특정 댓글 ID를 받아 상태를 업데이트하는 함수
  const toggleUserSettingsModal = (commentId: number) => {
    setIsUserSettingsModalVisible(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const [inViteMemberVisible, setInViteMemberVisible] = useRecoilState(
    isInviteMemberModalState,
  );

  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleInviteMemberModal = () => {
    setInViteMemberVisible(!inViteMemberVisible);
  };

  // 현재 내 워크스페이스 있는 사람 목록
  const { data: currentUserData, isSuccess: currentUserSuccess } = useQuery(
    'currentUser',
    async () => {
      // workspace/{:workspaceId}/favorites/available-users
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/favorites/available-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('받아온 유저 목록', res.data);
      return res.data;
    },
  );

  useEffect(() => {
    if (currentUserSuccess) {
      // console.log(currentUserData);
      setWorkspaceUserList(currentUserData);
    }
  }, [currentUserData, currentUserSuccess]);

  const deleteWorkspaceMutation = useMutation(
    async (workspaceId: number) => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    },
    {
      // 성공 시 호출될 콜백
      onSuccess: () => {
        // 쿼리 데이터를 무효화하여 리프레시
        queryClient.invalidateQueries('currentUser');

        router.push('/workspace');
      },
    },
  );

  const deleteWorkspaceHandler = () => {
    const confirm = window.confirm(
      '정말로 이 워크스페이스를 삭제하시겠습니까?',
    );
    if (!confirm) return;
    // 현재 워크스페이스 ID를 사용하여 워크스페이스를 삭제
    if (currentWorkspace && currentWorkspace.workspace_id) {
      deleteWorkspaceMutation.mutate(currentWorkspace.workspace_id);
    }
  };

  // 파일 선택
  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event: any) => {
    // 파일 선택
    const file = event.target.files[0];
    if (!file) return;

    // 파일 유형 확인
    if (!file.type.startsWith('image/')) {
      setFileError('이미지 파일만 업로드 가능합니다.');
      return;
    } else {
      setFileError(null);
    }
    const targetSize = 300;
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const img = document.createElement('img');
        img.src = e.target.result;

        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          // Pica 리사이징
          await pica().resize(img, canvas);

          canvas.toBlob(async resizedBlob => {
            if (resizedBlob) {
              setSelectedFile(
                new File([resizedBlob], file.name, { type: 'image/jpeg' }),
              );
            }

            // 파일 미리보기 URL과 파일 이름 설정
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
          });
        };
      }
    };
    reader.readAsDataURL(file);
  };

  // 최종 POST 요청 두 가지 : file, 유저 name
  useImperativeHandle(ref, () => ({
    async handleUpdateAccount() {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      // 유저 이름 정보를 formData에 추가
      const workspaceName = workspaceNameRef.current?.value;
      if (workspaceName) {
        formData.append('name', workspaceName);
      }
      try {
        const accessToken = Cookies.get('ACCESS_KEY');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('Workspace Profile updated', response.data);
        // setCreateWorkspaceVisible(false);
        // setSelectedFile(null);
        window.location.reload();
      } catch (error) {
        console.error('Error updating user account:', error);
      }
    },
  }));

  // 떠나기 로직
  const leaveWorkspaceMutation = useMutation(
    async () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkspace.workspace_id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    },
    {
      onSuccess: () => {
        router.push('/home');
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          setModalMessage(error.response.data.message);
          setModalVisible(true);
        } else {
          console.error('Error leaving the workspace:', error);
        }
      },
    },
  );

  const leaveWorkspaceHandler = () => {
    const confirm = window.confirm('정말로 이 워크스페이스를 떠나시겠습니까?');
    if (!confirm) return;
    leaveWorkspaceMutation.mutate();
  };

  return (
    <div className="text-black">
      <div className="mb-[0.75rem] font-semibold leading-[1.6rem]">설정</div>
      <div className="flex gap-[1.25rem] mb-[1.5rem] w-full">
        <div className="min-w-[3.75rem] min-h-[3.75rem]">
          {filePreview ? (
            <Image
              src={filePreview}
              width={60}
              height={60}
              alt="기본유저"
              onClick={handleAddButtonClick}
              className="imageUpload"
            />
          ) : (
            <Image
              src={currentWorkspace.workspace_imgUrl || defaultUser}
              width={60}
              height={60}
              alt="기본유저"
              onClick={handleAddButtonClick}
              className="imageUpload"
            />
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-[0.62rem]">
            <div className="text-[0.875rem] font-semibold">
              워크스페이스 이름
            </div>
            <div
              className="flex items-center border-[1px] border-gray-300 rounded-[0.5rem]
              px-[0.75rem] py-[0.25rem] w-full justify-between"
            >
              <div className="w-full">
                <input
                  className="focus:outline-none text-[0.875rem] w-full"
                  type="text"
                  placeholder={currentWorkspace?.workspace_name}
                  ref={workspaceNameRef}
                />
              </div>
              <div className="cursor-pointer">
                <Image src={cancel} alt="취소" />
              </div>
            </div>
            <div className="flex justify-end">
              <div
                className="text-[0.75rem] text-gray-5 cursor-pointer"
                onClick={deleteWorkspaceHandler}
              >
                이 워크스페이스를 삭제하기
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[0.75rem]">
        <div className="flex justify-between px-[0.72rem]">
          <div className="font-semibold">멤버</div>
          <div className="relative">
            <div
              className="cursor-pointer relative w-[1.5rem] h-[1.5rem] hover:bg-gray-2 rounded-[0.5rem]"
              onClick={toggleInviteMemberModal}
            >
              <Image src={plus} alt="추가" />
            </div>
            {inViteMemberVisible && <InviteMemberModal />}
          </div>
        </div>
        <div className="users flex flex-col gap-[0.62rem] overflow-y-auto h-[11rem] text-[0.875rem]">
          {workspaceUserList.map(user => (
            <div
              key={user.userId}
              className="user flex items-center justify-between p-[0.75rem]"
            >
              <div className="flex items-center gap-[0.75rem]">
                <div className="h-[1.5rem] w-[1.5rem]">
                  <Image
                    src={user.imgUrl}
                    width={24}
                    height={24}
                    alt="기본유저"
                  />
                </div>
                <div>{user.nickname}</div>
              </div>
              {user.admin === true ? (
                <div className="cursor-pointer">
                  <Image src={ownerIcon} alt="owner" />
                </div>
              ) : (
                <div
                  className="cursor-pointer relative"
                  onClick={() => toggleUserSettingsModal(user.userId)}
                >
                  <Image src={verticalSetting} alt="member" />
                  {isUserSettingsModalVisible[user.userId] && (
                    <UserSettingsModal userId={user.userId} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end cursor-pointer">
          <div
            className="border-[1px] p-[0.62rem] rounded-[0.25rem] border-[#DFE0E8]
            hover:bg-gray-2"
            onClick={leaveWorkspaceHandler}
          >
            <div className="text-[0.8rem]">이 워크스페이스를 떠나기</div>
          </div>
        </div>
      </div>
    </div>
  );
});

WorkspaceOwnerSettings.displayName = 'WorkspaceSettings';
export default WorkspaceOwnerSettings;
