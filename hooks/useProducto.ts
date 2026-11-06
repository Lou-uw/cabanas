import { useState, useEffect } from 'react'
import {obtenerProducto} from "../services/ProductoService"

export function useProducto() {
    const [prods, setProds] = useState([])
    const [loading, setLoading] = useState([true])
    const [error, setError] = useState()
    useEffect (() => {
        async function traerProds() {
            try {
                const data = await obtenerProducto()
                setProds(data)
                if(!data.ok) {
                    throw new Error("error")
                }
            } catch(error) {
                console.log(error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }
    },[])
    return{prods, loading, error }
}