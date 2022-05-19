import { instance } from "@/service/instance";

const path = '/menu';

async function getListMenu() {
    const { data } = await instance.get(path);
    return data;
}

export {
    getListMenu
}
