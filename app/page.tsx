"use client";

import { useS3Upload } from "next-s3-upload";
import { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import { PhotoIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { MenuGrid } from "@/components/menu-grid";
import Image from "next/image";
import { italianMenuUrl, italianParsedMenu } from "@/lib/constants";

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  menuImage: {
    b64_json: string;
  };
}

export default function Home() {
  const { uploadToS3 } = useS3Upload();
  const [menuUrl, setMenuUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedMenu, setParsedMenu] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadingRef = useRef<HTMLDivElement>(null);

  const scrollToLoading = () => {
    loadingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleFileChange = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setStatus("uploading");
    setMenuUrl(objectUrl);

    setIsLoading(true);
    scrollToLoading();

    const { url } = await uploadToS3(file);
    setMenuUrl(url);
    setStatus("parsing");

    const res = await fetch("/api/parseMenu", {
      method: "POST",
      body: JSON.stringify({
        menuUrl: url,
      }),
    });
    const json = await res.json();

    console.log({ json });

    setStatus("created");
    setIsLoading(false);
    setParsedMenu(json.menu);
  };

  const handleSampleImage = async () => {
    setStatus("parsing");
    setIsLoading(true);
    scrollToLoading();

    setMenuUrl(italianMenuUrl);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setStatus("created");
    setIsLoading(false);
    setParsedMenu(italianParsedMenu);
  };

  const filteredMenu = parsedMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container text-center px-4 py-8 bg-white max-w-5xl mx-auto">
      <div className="max-w-2xl text-center mx-auto sm:mt-20 mt-2">
        <p className="mx-auto mb-5 w-fit rounded-2xl border px-4 py-1 text-sm text-slate-500">
          100% free and powered by{" "}
          <a
            href="https://dub.sh/together-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition font-bold"
          >
            Together AI
          </a>
          !
        </p>
        <h1 className="mb-6 text-balance text-6xl font-bold text-zinc-800">
          Visualize your menu with AI
        </h1>
      </div>
      <div className="max-w-3xl text-center mx-auto">
        <p className="mb-8 text-lg text-gray-500 text-balance">
          Take a picture of your menu and get pictures of each dish so you can
          better decide what to order.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {status === "initial" && (
          <>
            <Dropzone
              accept={{
                "image/*": [".jpg", ".jpeg", ".png"],
              }}
              multiple={false}
              onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps, isDragAccept }) => (
                <div
                  className={`mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
                    isDragAccept ? "border-blue-500" : "border-gray-300"
                  }`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative rounded-md bg-white font-semibold text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-600"
                      >
                        <p className="text-xl">Upload your menu</p>
                        <p className="mt-1 font-normal text-gray-600">
                          or take a picture
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>
            <button
              className="mt-5 font-medium text-blue-400 text-md underline decoration-transparent hover:decoration-blue-200 decoration-2 underline-offset-4 transition hover:text-blue-500"
              onClick={handleSampleImage}
            >
              Need an example image? Try ours.
            </button>
          </>
        )}

        {menuUrl && (
          <div className="my-10 mx-auto flex flex-col items-center">
            <Image
              width={1024}
              height={768}
              src={menuUrl}
              alt="Menu"
              className="w-40 rounded-lg shadow-md"
            />
          </div>
        )}

        <div ref={loadingRef}>
          {isLoading && (
            <div className="mt-10 flex flex-col items-center">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
                <p className="text-lg text-gray-600">
                  Creating your visual menu...
                </p>
              </div>
              <div className="w-full max-w-2xl space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {parsedMenu.length > 0 && (
        <div className="mt-10">
          <h2 className="text-4xl font-bold mb-5">
            Menu – {parsedMenu.length} dishes detected
          </h2>
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <MenuGrid items={filteredMenu} />
        </div>
      )}
    </div>
  );
}
