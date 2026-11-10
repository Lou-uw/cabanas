import { useState, useEffect } from 'react'
import {obtenerTamanio} from "../services/TamanioService"
import { Tamanio } from '@/types/tamanio'

export function useTamanio() {
    const [tamanios, setTamanios] = useState<Tamanio[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect (() => {
        async function traerTamanios() {
            try {
                const data = await obtenerTamanio()
                setTamanios(data)
            } catch(error) {
                console.log(error)
                setError(error instanceof Error ? error.message : String(error))
            } finally {
                setLoading(false)
            }
        }
        traerTamanios()
    },[])
    return{ tamanios, loading, error }
}
