import { useState, useEffect } from 'react'
import { obtenerCombo } from '../services/ComboService'
import { Combo } from '@/types/combo'

export function useCombo() {
    const [combos, setCombos] = useState<Combo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect (() => {
        async function traerCombos() {
            try {
                const data = await obtenerCombo()
                setCombos(data.filter((combo) => combo.activo))
            } catch(error) {
                console.log(error)
                setError(error as string)
            } finally {
                setLoading(false)
            }
        }
        traerCombos()
    },[])
    return{ combos, loading, error }
}
