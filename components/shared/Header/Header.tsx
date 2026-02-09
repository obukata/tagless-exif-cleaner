import Link from "next/link"
import './Header.css'

export default function Header() {
  return (
    <>
      <div className="mx-auto pt-20 max-w-6xl text-center flex flex-col gap-8">
        <div className="flex flex-col gap-4 items-center">
          <p><img className="w-24" src="/symbol.svg" alt="" width={44} height={44} /></p>
          <p><img className="w-36" src="/logo.svg" alt="" width={45} height={12} /></p>
        </div>
        <p className="font-bold text-xl text-neutral-400">GPS情報や回転情報をマルっと削除！</p>
      </div>
    </>
  )
}