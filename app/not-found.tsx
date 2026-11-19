import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-dvh place-items-center p-6 text-center"><div><p className="font-mono text-sm text-primary">404</p><h1 className="mt-3 text-3xl font-semibold">Position not found</h1><p className="mt-3 text-muted-foreground">The page may have moved or the address is incorrect.</p><Button className="mt-6" render={<Link href="/" />}>Return home</Button></div></main>; }
