import { instanceAdmin } from "@/service/instance";

const keycloak = {
    get:url=> instanceAdmin.get(url).then(res=>res.data),
    getBy:({url,data})=> instanceAdmin.get(url,data).then(res=>res.data),
    post:({url,data})=> instanceAdmin.post(url,data).then(res=>res.data),
    put:({url,data})=> instanceAdmin.put(url,data).then(res=>res.data),
    delete:({url,data})=> instanceAdmin.delete(url,data).then(res=>res.data),
    patch:({url,data})=> instanceAdmin.patch(url,data).then(res=>res.data)
}
export default keycloak;