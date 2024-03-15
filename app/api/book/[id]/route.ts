import { kv } from "@vercel/kv";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id);
  kv.set("book_id", id);
  return new Response(`Currently reading ${id}`, { status: 200 });
}
