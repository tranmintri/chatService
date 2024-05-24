import UserSettingNavbar from "../../components/UserSettingNavbar/UserSettingNavbar";
import {Outlet, useNavigate} from "react-router-dom";
import Page from "../../constants/Page";

const UserSettingPage = () => {
    const navigate = useNavigate();

    const handleBtnCloseClick = () => {
        navigate(Page.MAIN_PAGE.path, {replace: true});
    };

    return (
        <div className="tw-bg-dark-1 tw-h-full tw-min-h-screen tw-text-dark-1">
            <div className="tw-max-w-screen-lg tw-h-full tw-min-h-screen tw-mx-auto tw-flex ">
                <div className="tw-w-[12rem]">
                    <UserSettingNavbar/>
                </div>
                <div className="tw-flex-1">
                    <Outlet/>

                    <button
                        className="tw-fixed tw-top-2.5 tw-right-2.5 tw-text-white tw-text-3xl"
                        onClick={handleBtnCloseClick}
                    >
                        <i className="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSettingPage;
