import { instance } from "@/service/instance"
export async function getUserByOperator() {
 const { data } = await instance.get("/users/operador")
 return data;
}
