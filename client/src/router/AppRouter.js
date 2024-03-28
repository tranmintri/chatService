import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Page from "../constants/Page";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={Page.SIGN_IN_PAGE.path} element={Page.SIGN_IN_PAGE.element}/>
                <Route path={Page.SIGN_UP_PAGE.path} element={Page.SIGN_UP_PAGE.element}/>
                <Route path={Page.SIGN_UP_SUCCESS_PAGE.path} element={Page.SIGN_UP_SUCCESS_PAGE.element}/>
                <Route path={Page.MAIN_PAGE.path} element={Page.MAIN_PAGE.element} />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;