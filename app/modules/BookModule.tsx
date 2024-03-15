import { kv } from "@vercel/kv";
import Block from "../ui/Block";
import Image from "next/image";
import * as cheerio from "cheerio";
import { BooksIcon } from "../icons";

async function getCurrentlyReading() {
  try {
    const bookId = await kv.get("book_id");

    if (!bookId) return null;

    const response = await fetch(
      `https://www.goodreads.com/book/show/${bookId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to Goodreads webpage");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $(".Text__title1");
    const authors = $(".ContributorLink");
    const cover = $(".ResponsiveImage");

    return {
      url: `https://www.goodreads.com/book/show/${bookId}`,
      title: $(title).text(),
      authors: $(authors[0]).text().trim(),
      cover: $(cover).attr("src"),
    };
  } catch (error) {
    console.error(error);
  }
}
// 16634
export default async function BookModule() {
  const bookData = await getCurrentlyReading();

  return (
    <Block className="p-2">
      {bookData?.cover ? (
        <a href={bookData?.url}>
          <div className="w-full aspect-square relative mb-2">
            <Image
              fill
              src={bookData?.cover}
              priority
              style={{ objectFit: "cover" }}
              alt={"Album cover"}
              className="rounded-lg drop-shadow"
            />
          </div>
        </a>
      ) : (
        <div
          style={{ height: 250, width: 250 }}
          className="flex items-center justify-center text-zinc-600 bg-zinc-900 rounded mb-2"
        >
          <BooksIcon />
        </div>
      )}

      <div className="font-title font-medium">
        <h2 className="font-medium font-sans text-sm text-zinc-700">
          Currently reading...
        </h2>

        {!bookData ? (
          <span>I'm not.</span>
        ) : (
          <>
            <p>{bookData?.title}</p>
            <small className="text-sm text-zinc-200">{bookData?.authors}</small>
          </>
        )}
      </div>
    </Block>
  );
}
