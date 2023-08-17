import React from 'react';
import OtherTodo from '@/components/otherTodo';

const ViewOtherGroup = () => {
  return (
    <div className="px-[5rem] py-[3.75rem]">
      <div className="cards grid grid-cols-3 gap-x-[3.12rem] gap-y-[3.75rem]">
        <OtherTodo />
        <OtherTodo />
        <OtherTodo />
        <OtherTodo />
        <OtherTodo />
      </div>
    </div>
  );
};

export default ViewOtherGroup;
