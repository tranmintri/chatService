import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "./authApi"
import { useEffect } from "react";
import { getUser, removeUser, saveUser } from "../utils/UserStorage";

export const useGetUser = () => {
    const { data: user } = useQuery({
        queryKey: ['USER'],
        queryFn: () => getUserInfo(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        initialData: getUser(),
        onError: () => {
            removeUser();
        }
    });

    useEffect(() => {
        if(!user) removeUser();
        else saveUser(user);
    }, [user]);

    return {
        user: user ?? null
    }
}