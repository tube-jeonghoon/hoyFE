import React, { useState } from 'react';
import Image from 'next/image';
import cancelBtn from '../../../public/img/cancel.svg';
import defaultUser from '../../../public/img/defaultUser.png';
import { currentWorkspaceState } from '@/store/atom/userStatusState';
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';

type Alarm = {
  alarm_id: number;
  alarm_status: string;
  nickname: string;
  status: string;
  task_title: string;
  imgUrl: string;
};

const UpdateModal = () => {
  const [currentWorkSpace, setCurrentWorkSpace] = useRecoilState(
    currentWorkspaceState,
  );
  const [isModalOpen, setModalOpen] = useState(true);
  const [alarmList, setAlarmList] = useState<Alarm[]>([]); // 서버 res.data

  const fetchAlarms = async () => {
    const accessToken = Cookies.get('ACCESS_KEY');
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/alarm`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(res.data);
    setAlarmList(res.data);
    return res.data;
  };

  const queryClient = useQueryClient();

  const {
    data: alarms,
    isLoading,
    isError,
    refetch,
  } = useQuery<Alarm[]>('alarms', fetchAlarms, {
    refetchInterval: 5000,
  });

  const fetchUpdate = async (alarmId: number) => {
    const accessToken = Cookies.get('AECCESS_KEY');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/alarm/${alarmId}/status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  };

  const markAsReadMutation = useMutation(alarmId => fetchUpdate(alarmId), {
    onMutate: (alarmId: number) => {
      // 이전 알림 데이터를 저장해둠
      const previousAlarms = queryClient.getQueryData<Alarm[]>('alarms') || [];
      // UI 업데이트 (alarmId에 해당하는 알림을 READ로 처리)
      const updatedAlarms = previousAlarms.map(alarm =>
        alarm.alarm_id === alarmId ? { ...alarm, status: 'READ' } : alarm,
      );
      // 'UNREAD' 상태의 알람을 배열 앞쪽으로 정렬하되, 방금 'READ' 처리된 알람은 'READ' 알람 중 맨 앞에 위치
      updatedAlarms.sort((a, b): any => {
        if (a.status === 'UNREAD' && b.status === 'READ') return -1;
        if (a.status === 'READ' && b.status === 'UNREAD') return 1;
        if (
          a.status === 'READ' &&
          b.status === 'READ' &&
          a.alarm_id === alarmId
        )
          return -1;
        if (
          a.status === 'READ' &&
          b.status === 'READ' &&
          b.alarm_id === alarmId
        )
          return 1;
        return 0;
      });
      queryClient.setQueryData('alarms', updatedAlarms);
      // Return a snapshot so we can rollback in case of failure
      return { previousAlarms };
    },
    onError: (error, alarmId, context) => {
      // 요청 실패시 이전 데이터로 롤백
      queryClient.setQueryData('alarms', context?.previousAlarms);
    },
    onSuccess: () => {
      // 성공시 캐시된 데이터를 무효화하여 새로운 요청 트리거
      queryClient.invalidateQueries('alarms');
    },
  });

  const fetchDelete = async (alarmId: number) => {
    const accessToken = Cookies.get('ACCESS_KEY');
    return await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/${currentWorkSpace.workspace_id}/alarm/${alarmId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  const deleteMutation = useMutation(alarmId => fetchDelete(alarmId), {
    onMutate: (alarmId: number) => {
      // 이전 알림 데이터를 저장해둠
      const previousAlarms =
        queryClient.getQueryData<{ alarm_id: number }[]>('alarms') || [];
      // UI상 즉시 알람 삭제하여 화면에 반영
      const updatedAlarms = previousAlarms.filter(
        alarm => alarm.alarm_id !== alarmId,
      );
      queryClient.setQueryData('alarms', updatedAlarms);
      // 이전 알림 데이터를 반환하여, onError에서 롤백 가능하게 함
      return { previousAlarms };
    },
    onError: (error, alarmId, context) => {
      // 요청 실패시 이전 데이터로 롤백
      queryClient.setQueryData('alarms', context?.previousAlarms);
    },
    onSuccess: () => {
      // 성공시 캐시된 데이터를 무효화하여 새로운 요청 트리거
      queryClient.invalidateQueries('alarms');
    },
  });

  // if (isLoading) return <div>Loading...</div>;

  // if (isError) return <div>Error occurred</div>;

  const handleOutsideClick = (e: any) => {
    // 클릭한 대상이 바깥 영역이면 모달 닫기
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };

  const handleModalContentClick = (e: any) => {
    // 모달 내부 클릭 시
    e.stopPropagation();
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="absolute top-0 left-[13rem] z-[90] flex items-center justify-center bg-white min-w-[24rem]"
      onClick={handleOutsideClick}
    >
      <div
        className="px-[2.25rem] py-[1.5rem] border border-gray-[#DFE0E8]
        rounded-[0.5rem] flex flex-col gap-[0.75rem]"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-end">
          <div className="border border-gray-[#DFE0E8] rounded-[0.5rem] px-[0.75rem] py-[0.25rem]">
            <div className="text-[0.875rem] leading-[1.4rem]">모두 삭제</div>
          </div>
        </div>
        <div className="alert-cards flex flex-col gap-[0.7rem]">
          {alarmList.map(data => (
            <div
              key={data.alarm_id}
              className={`card w-[20rem] p-[0.75rem] border border-gray-[#DFE0E8] rounded-[0.5rem]
                flex justify-between items-center gap-[0.62rem]
                ${data.alarm_status === 'READ' ? 'opacity-50' : ''}
                `}
              onClick={() => {
                if (data.alarm_status != 'READ') {
                  markAsReadMutation.mutate(data.alarm_id);
                }
              }}
            >
              <div className="flex items-center gap-[0.62rem]">
                <div className="border border-none rounded-[0.5rem] min-w-[1.5rem]">
                  <Image
                    src={data.imgUrl}
                    width={24}
                    height={24}
                    alt="유저 프로필"
                  />
                </div>
                <div className="flex gap-[0.25rem]">
                  <div>{`${data.nickname} 님이 ${data.task_title}에 코멘트를 남겼습니다.`}</div>
                </div>
              </div>
              <div
                className="min-w-[1.5rem] cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  deleteMutation.mutate(data.alarm_id);
                }}
              >
                <Image src={cancelBtn} alt="삭제" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UpdateModal;
