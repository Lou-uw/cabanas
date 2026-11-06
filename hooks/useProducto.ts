import { useState, useEffect } from 'react'
import {obtenerProducto} from "../services/ProductoService"
import { Producto } from '@/types/producto'

export function useProducto() {
    const [prods, setProds] = useState<Producto[]>([]) 
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect (() => {
        async function traerProds() {
            try {
                const data = await obtenerProducto()
                setProds(data)
            } catch(error) {
                console.log(error)
                setError(error as string)
            } finally {
                setLoading(false)
            }
        }
        traerProds()
    },[])
    return{prods, loading, error }
}