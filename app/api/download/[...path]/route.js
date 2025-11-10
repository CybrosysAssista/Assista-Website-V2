import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5173";

export async function GET(_request, { params }) {
  const { path } = params || {};

  if (!Array.isArray(path) || path.length < 3) {
    return NextResponse.json(
      { error: "Invalid download path" },
      { status: 400 }
    );
  }

  const requestedFormat = path[path.length - 1];
  const normalizedFormat = requestedFormat === "pdf" ? "pdf" : "md";
  const repoSegments = path.slice(0, -1);
  const encodedRepoPath = repoSegments.map(encodeURIComponent).join("/");
  const encodedFormat = encodeURIComponent(normalizedFormat);

  const targetUrl = `${API_BASE_URL}/api/download/${encodedRepoPath}/${encodedFormat}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Failed to download documentation (${response.status})`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    headers.set("content-type", contentType);

    const repoName =
      repoSegments[repoSegments.length - 1] || "documentation";
    const safeBaseName = repoName.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const downloadFilename = `${safeBaseName}.${normalizedFormat}`;

    headers.set(
      "content-disposition",
      `attachment; filename="${downloadFilename}"`
    );

    return new NextResponse(arrayBuffer, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Download proxy failed:", error);
    return NextResponse.json(
      { error: "Unexpected error while downloading documentation" },
      { status: 500 }
    );
  }
}

