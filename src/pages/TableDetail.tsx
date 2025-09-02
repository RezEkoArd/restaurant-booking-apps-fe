import { useParams } from 'react-router-dom'

export default function TableDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detail Meja {id}</h1>
      <p>Halaman detail untuk meja nomor {id}.</p>
    </div>
  )
}