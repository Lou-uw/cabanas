const URL ="127.0.0.1:8080/api/productos"

export async function obtenerProducto() {
    const respuesta = await fetch(URL)

    if(!respuesta.ok) {
        throw new Error("error")
    }
    return respuesta.json()
}