import {
  type EntryType,
  type RunnerVersionItem,
  entryTypeKeys,
  EntryTypes,
} from "@/types/runtime";
import { cacheLife } from "next/cache";

export function generateStaticParams() {
  return Object.keys(EntryTypes).map((type) => ({ type }));
}

const fetchRunnerInfo = async (type: EntryType) => {
  "use cache";
  cacheLife({ revalidate: 3600 });

  const resp = await fetch(EntryTypes[type]);
  if (!resp.ok)
    throw new Error(
      `[${resp.status}] "${resp.statusText}" | Error while fetching "${resp.url}"`,
    );

  const data = await resp.text();
  const modules = data
    .matchAll(/<module[^>]+>/gms)
    .map<RunnerVersionItem>(([str]) => {
      const info = str
        .matchAll(/[\s^](?<key>[^=]+)="(?<value>[^"]+)"/g)
        .reduce<Record<string, string>>((o, m) => {
          o[m.groups!.key] = m.groups!.value;
          return o;
        }, {});

      const {
        name: platform = "unknown",
        "sparkle:version": version = "0.0.0.0",
        url = "/",
      } = info;
      return { platform, url, version };
    })
    .filter(({ platform: p }) => !p.startsWith("base-module"))
    .toArray();

  return modules;
};

const isValidType = (type: string): type is EntryType =>
  typeof type === "string" && entryTypeKeys.includes(type as any);

export async function GET(
  _: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  if (!isValidType(type)) return new Response(null, { status: 400 });

  const info = await fetchRunnerInfo(type);
  return Response.json(info);
}
