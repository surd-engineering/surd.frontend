function platformName(): string {
  if (typeof navigator === "undefined") return "Unknown device";

  const ua = navigator.userAgent;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";

  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/CrOS/.test(ua)) return "Chromebook";
  if (platform === "Android" || /Android/.test(ua)) return "Android device";
  if (platform === "macOS" || /Macintosh|Mac OS X/.test(ua)) return "Mac";
  if (platform === "Windows" || /Windows/.test(ua)) return "Windows PC";
  if (platform === "Linux" || /Linux/.test(ua)) return "Linux PC";

  return "Unknown device";
}

function browserName(): string {
  if (typeof navigator === "undefined") return "Browser";

  const ua = navigator.userAgent;

  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";

  return "Browser";
}

export function deviceName(): string {
  return `${platformName()} · ${browserName()}`;
}

function timeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

export function deviceContext() {
  const name = deviceName();

  return {
    device_id: name,
    device_name: name,
    timezone: timeZone(),
    datetime: new Date().toISOString(),
  };
}
