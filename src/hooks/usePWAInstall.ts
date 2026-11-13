import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

// Preserve early events before hook mount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    window.__deferredPWAInstallPrompt = e as BeforeInstallPromptEvent;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt) {
      return window.__deferredPWAInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect if already running in standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect OS environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    const isWin = /windows|win32/.test(userAgent);
    const isDesk = !isIOSDevice && !isAndroidDevice && !/mobile|tablet/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsWindows(isWin);
    setIsDesktop(isDesk);

    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      window.__deferredPWAInstallPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    const promptToUse = deferredPrompt || window.__deferredPWAInstallPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          window.__deferredPWAInstallPrompt = null;
          return true;
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    }
    return false;
  };

  const downloadAppShortcut = (appUrl: string = window.location.href) => {
    const cleanUrl = appUrl.split('?')[0];
    const iconUrl = typeof window !== 'undefined' ? `${window.location.origin}/assets/kinship_icon.jpg` : '/assets/kinship_icon.jpg';
    const shortcutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinship & Family in Islam</title>
  <link rel="icon" href="${iconUrl}">
  <meta http-equiv="refresh" content="0; url=${cleanUrl}">
  <style>
    body { background: #064e3b; color: #fef3c7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); }
  </style>
</head>
<body>
  <div class="box">
    <h2>Kinship & Family in Islam · صلة الرحم</h2>
    <p>Opening application...</p>
    <a href="${cleanUrl}" style="color:#fde68a;font-weight:bold;">Tap here if not redirected automatically</a>
  </div>
  <script>
    window.location.replace("${cleanUrl}");
  </script>
</body>
</html>`;

    const blob = new Blob([shortcutHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kinship-and-Family-Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return {
    isInstallable: !!deferredPrompt || !!(typeof window !== 'undefined' && window.__deferredPWAInstallPrompt),
    isInstalled,
    isIOS,
    isAndroid,
    isWindows,
    isDesktop,
    deferredPrompt,
    triggerInstall,
    downloadAppShortcut,
  };
}
