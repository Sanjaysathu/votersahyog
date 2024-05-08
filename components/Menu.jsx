"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Menu({ user, signOut }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ml-auto px-4 self-center">
      <Image src="/images/menu-black.svg" priority={true} height={30} width={30} alt="Menu" onClick={() => setShow(!show)} />
      <div className={`hamburger-menu shadow ${show ? "active" : ""}`}>
        <div className="flex w-full border-b border-gray-300">
          {user ? (
            <form action={signOut} className="mx-auto">
              <button className="py-2 px-3 flex mx-auto font-medium rounded-md no-underline">Logout</button>
            </form>
          ) : (
            <Link href="/login" className="py-2 px-3 flex mx-auto font-medium rounded-md no-underline">
              Official Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
