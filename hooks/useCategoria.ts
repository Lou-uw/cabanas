import { useState, useEffect } from 'react'
import {obtenerCategoria} from "../services/CategoriaService"
import { Categorias } from '@/types/categorias'

export function useCategoria() {
    const [categorias, setCategorias] = useState<Categorias[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect (() => {
        async function traerCategorias() {
            try {
                const data = await obtenerCategoria()
                setCategorias(data)
            } catch(error) {
                console.log(error)
                setError(error instanceof Error ? error.message : String(error))
            } finally {
                setLoading(false)
            }
        }
        traerCategorias()
    },[])
    return{categorias, loading, error }
}