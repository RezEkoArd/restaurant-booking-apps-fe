import "@/style/loading.css";

export const loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
