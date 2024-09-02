import Logo from "@/components/Logo";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PaymentForm } from "@/components/PaymentForm";
import Image from "next/image";

export default function Home() {
  return (
    <main>
        <div className="flex">
          <div className="w-[65%] py-10 md:py-14 px-5 md:px-20">
            <Logo />
            <PaymentForm />
          </div>
          <div className="w-[25%] bg-slate-100">Card</div>
        </div>
    </main>
  );
}
