import { Producto } from "@/types/producto"
import { url_api } from "@/config"

export async function obtenerProducto(): Promise<Producto[]> {
    const respuesta = await fetch(url_api+"productos")

    if(!respuesta.ok) {
        throw new Error("error")
    }
    const response = respuesta.json()
    console.table(response)
    return response as Promise<Producto[]>
}