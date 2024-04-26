import React from "react";

const MessageResultCard = () => {
  return (
    <div className="tw-w-full">
      <div className="tw-pl-4  tw-flex tw-justify-start tw-items-center tw-border-b-2 tw-border-slate-200">
        <div className="tw-w-2/12">
          <img
            className=""
            src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745|https://bucket11113.s3.ap-southeast-1.amazonaws.com/9893a67d-1684-4849-978f-ecdc1a2f4c88"
            alt=""
            width={50}
            height={50}
          />
        </div>
        <div className="tw-w-8/12 tw-mt-3 tw-text-sm tw-pl-2">
          <p className="tw-font-bold tw-text-[18px]">aaaaaaaaaa</p>
          <p>aaaaaaaaaaa</p>
        </div>
        <div className="tw-w-2/12 tw-content-end tw-text-sm">
          <p>2 days</p>
        </div>
      </div>
    </div>
  );
};

export default MessageResultCard;
