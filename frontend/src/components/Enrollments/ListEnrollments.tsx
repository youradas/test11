import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import { saveFile } from '../../helpers/fileSaver';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import { Pagination } from '../Pagination';
import LoadingSpinner from '../LoadingSpinner';
import Link from 'next/link';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  enrollments: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const ListEnrollments = ({
  enrollments,
  loading,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_ENROLLMENTS');

  const corners = useAppSelector((state) => state.style.corners);
  const bgColor = useAppSelector((state) => state.style.cardsColor);

  return (
    <>
      <div className='relative overflow-x-auto p-4 space-y-4'>
        {loading && <LoadingSpinner />}
        {!loading &&
          enrollments.map((item) => (
            <CardBox
              hasTable
              isList
              key={item.id}
              className={'rounded shadow-none'}
            >
              <div
                className={`flex rounded  dark:bg-dark-900  border  border-stone-300  items-center overflow-hidden`}
              >
                <Link
                  href={`/enrollments/enrollments-view/?id=${item.id}`}
                  className={
                    'flex-1 px-4 py-6 h-24 flex divide-x-2  divide-stone-300   items-center overflow-hidden`}> dark:divide-dark-700 overflow-x-auto'
                  }
                >
                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>Student</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.studentsOneListFormatter(item.student)}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>Course</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.coursesOneListFormatter(item.course)}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>PaymentStatus</p>
                    <p className={'line-clamp-2'}>{item.payment_status}</p>
                  </div>
                </Link>
                <ListActionsPopover
                  onDelete={onDelete}
                  itemId={item.id}
                  pathEdit={`/enrollments/enrollments-edit/?id=${item.id}`}
                  pathView={`/enrollments/enrollments-view/?id=${item.id}`}
                  hasUpdatePermission={hasUpdatePermission}
                />
              </div>
            </CardBox>
          ))}
        {!loading && enrollments.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </div>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </>
  );
};

export default ListEnrollments;
