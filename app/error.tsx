"use client";
import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="grid min-h-dvh place-items-center p-6"><div className="w-full max-w-xl"><ErrorState action={<Button onClick={reset}>Try again</Button>} /></div></main>; }
