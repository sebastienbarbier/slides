import {
  MorphElement,
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import mark from './assets/shellui_transparent_logo.svg';
import wordmark from './assets/shellui_mark.svg';

export const design: DesignSystem = {
  palette: { bg: '#ffffff', text: '#111827', accent: '#e3a512' },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 168, body: 32 },
  radius: 20,
};

const muted = '#4b5563';
const line = '#e5e7eb';
const onGold = '#1a1408';
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const shellMorph: SlideTransition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
  },
  morph: { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const stage: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const heroWash: CSSProperties = {
  backgroundImage:
    'radial-gradient(820px 480px at 8% 0%, rgba(227, 165, 18, 0.22), transparent 70%), radial-gradient(640px 420px at 100% 100%, rgba(253, 230, 138, 0.45), transparent 72%)',
  backgroundColor: 'var(--osd-bg)',
};

const MOTION_CSS = `
@keyframes sui-dock {
  from { transform: translate3d(var(--sui-x, 0px), var(--sui-y, 28px), 0); }
  to { transform: translate3d(0, 0, 0); }
}
[data-osd-step="revealed"] .sui-dock {
  animation: sui-dock 420ms cubic-bezier(0, 0, 0.2, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-osd-step="revealed"] .sui-dock { animation: none; }
}
`;

function MotionCss() {
  useEffect(() => {
    const id = 'sui-motion';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = MOTION_CSS;
    document.head.appendChild(style);
  }, []);
  return null;
}

function Wordmark({ height }: { height: number }) {
  const width = Math.round(height * (1024 / 270));
  return (
    <img
      src={wordmark}
      alt="Shellui"
      width={width}
      height={height}
      style={{ width, height, display: 'block', objectFit: 'contain' }}
    />
  );
}

function Mark({ size }: { size: number }) {
  return (
    <img
      src={mark}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, display: 'block', objectFit: 'contain' }}
    />
  );
}

function PageNumber() {
  const { current, total } = useSlidePageNumber();
  return (
    <span
      style={{
        position: 'absolute',
        right: 72,
        bottom: 40,
        fontSize: 22,
        color: muted,
      }}
    >
      {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </span>
  );
}

function Stage({
  children,
  wash = false,
}: {
  children: ReactNode;
  wash?: boolean;
}) {
  return (
    <section style={{ ...stage, ...(wash ? heroWash : null) }}>
      <MotionCss />
      {children}
      <PageNumber />
    </section>
  );
}

function MiniWindow({
  label,
  width,
  height,
}: {
  label: string;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        background: '#ffffff',
        border: `1.5px solid ${line}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          borderBottom: `1px solid ${line}`,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: 'var(--osd-accent)',
          }}
        />
        <span style={{ fontSize: 22, color: muted }}>{label}</span>
      </div>
    </div>
  );
}

function ShellBox({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  return (
    <MorphElement id="shell">
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          boxSizing: 'border-box',
          background: '#ffffff',
          border: '1.5px solid #111827',
          borderRadius: 28,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 22px',
            borderBottom: `1px solid ${line}`,
          }}
        >
          <Mark size={28} />
          <span style={{ fontSize: 22, fontWeight: 600 }}>the shell</span>
        </div>
        <div style={{ position: 'relative', height: h - 64 }}>{children}</div>
      </div>
    </MorphElement>
  );
}

function Dock({
  x,
  y,
  fromX,
  fromY,
  title,
  detail,
}: {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  title: string;
  detail: string;
}) {
  const live = useIsActivePage();
  return (
    <div
      className={live ? 'sui-dock' : undefined}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 280,
        ['--sui-x' as string]: `${fromX}px`,
        ['--sui-y' as string]: `${fromY}px`,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: `1.5px solid ${line}`,
          borderLeft: '4px solid var(--osd-accent)',
          borderRadius: 12,
          padding: '16px 18px',
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: 22, color: muted }}>{detail}</div>
      </div>
    </div>
  );
}

const Title: Page = () => (
  <Stage wash>
    <div style={{ position: 'absolute', left: 120, top: 96 }}>
      <Wordmark height={64} />
    </div>
    <h1
      style={{
        position: 'absolute',
        left: 112,
        top: 300,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 600,
        letterSpacing: '-0.045em',
        lineHeight: 0.92,
      }}
    >
      Ship
      <br />
      sooner.
    </h1>
    <p
      style={{
        position: 'absolute',
        left: 124,
        top: 760,
        margin: 0,
        maxWidth: 640,
        fontSize: 32,
        lineHeight: 1.35,
        color: muted,
      }}
    >
      Without rebuilding basic features.
    </p>
    <a
      href="https://shellui.com"
      style={{
        position: 'absolute',
        left: 124,
        bottom: 88,
        fontSize: 22,
        fontWeight: 600,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      shellui.com
    </a>
  </Stage>
);

const Again: Page = () => (
  <Stage>
    <h2
      style={{
        position: 'absolute',
        left: 112,
        top: 220,
        margin: 0,
        fontSize: 200,
        fontWeight: 600,
        letterSpacing: '-0.05em',
        lineHeight: 0.9,
      }}
    >
      Again.
    </h2>
    <p
      style={{
        position: 'absolute',
        left: 120,
        bottom: 96,
        margin: 0,
        maxWidth: 560,
        fontSize: 28,
        lineHeight: 1.35,
        color: muted,
      }}
    >
      Navigation, sign-in, administration, and files. In every new app.
    </p>
    <Steps>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 1180, top: 160, ['--sui-x' as string]: '48px', ['--sui-y' as string]: '24px' }}>
          <MiniWindow label="Navigation" width={460} height={200} />
        </div>
      </Step>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 1236, top: 250, ['--sui-x' as string]: '48px', ['--sui-y' as string]: '24px' }}>
          <MiniWindow label="Sign-in" width={460} height={200} />
        </div>
      </Step>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 1292, top: 340, ['--sui-x' as string]: '48px', ['--sui-y' as string]: '24px' }}>
          <MiniWindow label="Admin" width={460} height={200} />
        </div>
      </Step>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 1348, top: 430, ['--sui-x' as string]: '48px', ['--sui-y' as string]: '24px' }}>
          <MiniWindow label="Files" width={460} height={200} />
        </div>
      </Step>
    </Steps>
  </Stage>
);

const Shell: Page = () => (
  <Stage>
    <ShellBox x={360} y={150} w={1200} h={720}>
      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 48,
          right: 48,
          bottom: 48,
          borderRadius: 18,
          border: '2px solid var(--osd-accent)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 36,
        }}
      >
        <span
          style={{
            alignSelf: 'flex-start',
            background: 'var(--osd-accent)',
            color: onGold,
            fontSize: 22,
            fontWeight: 600,
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          your app
        </span>
        <span style={{ marginTop: 16, fontSize: 28, color: muted }}>iframe</span>
      </div>
    </ShellBox>
    <p style={{ position: 'absolute', left: 120, bottom: 48, margin: 0, fontSize: 28, color: muted }}>
      Your frontend stays the product.
    </p>
  </Stage>
);
Shell.transition = shellMorph;

const Apps: Page = () => {
  const live = useIsActivePage();
  const rise = live ? 'sui-dock' : undefined;
  return (
    <Stage>
      <p
        style={{
          position: 'absolute',
          left: 1240,
          top: 280,
          margin: 0,
          width: 560,
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
        }}
      >
        One
        <br />
        interface.
      </p>
      <ShellBox x={96} y={160} w={1060} h={760}>
        <Steps>
          <Step>
            <div className={rise} style={{ position: 'absolute', left: 36, top: 32, ['--sui-y' as string]: '20px' }}>
              <MiniWindow label="React" width={470} height={280} />
            </div>
          </Step>
          <Step>
            <div className={rise} style={{ position: 'absolute', left: 530, top: 32, ['--sui-y' as string]: '20px' }}>
              <MiniWindow label="Vue" width={470} height={280} />
            </div>
          </Step>
          <Step>
            <div className={rise} style={{ position: 'absolute', left: 36, top: 340, ['--sui-y' as string]: '20px' }}>
              <MiniWindow label="Angular" width={470} height={280} />
            </div>
          </Step>
          <Step>
            <div className={rise} style={{ position: 'absolute', left: 530, top: 340, ['--sui-y' as string]: '20px' }}>
              <MiniWindow label="Next" width={470} height={280} />
            </div>
          </Step>
        </Steps>
      </ShellBox>
    </Stage>
  );
};
Apps.transition = shellMorph;

const Services: Page = () => (
  <Stage>
    <ShellBox x={560} y={210} w={800} h={560}>
      <div
        style={{
          position: 'absolute',
          left: 48,
          right: 48,
          top: 200,
          fontSize: 28,
          color: muted,
        }}
      >
        your app
      </div>
      <Steps>
        <Step>
          <div
            className="sui-dock"
            style={{
              position: 'absolute',
              left: 48,
              top: 28,
              ['--sui-y' as string]: '72px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#111827',
                color: '#f9fafb',
                borderRadius: 999,
                padding: '10px 16px',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Toast
            </span>
          </div>
        </Step>
      </Steps>
    </ShellBox>
    <Steps>
      <Step>
        <Dock x={140} y={300} fromX={-80} fromY={0} title="identity-service" detail="OAuth and JWT" />
      </Step>
      <Step>
        <Dock x={1480} y={300} fromX={80} fromY={0} title="storage-service" detail="Files, links, limits" />
      </Step>
      <Step>
        <Dock x={820} y={820} fromX={0} fromY={48} title="/admin" detail="Members and access" />
      </Step>
      <Step>
        <Dock x={820} y={80} fromX={0} fromY={-48} title="shellui.app" detail="Preview hosting" />
      </Step>
    </Steps>
    <p style={{ position: 'absolute', left: 140, bottom: 48, margin: 0, fontSize: 24, color: muted }}>
      Auth and storage can point at Supabase instead.
    </p>
  </Stage>
);
Services.transition = shellMorph;

const Start: Page = () => (
  <Stage>
    <p
      style={{
        position: 'absolute',
        left: 120,
        top: 200,
        margin: 0,
        fontFamily: mono,
        fontSize: 28,
        lineHeight: 1.6,
        color: muted,
      }}
    >
      npm install -g @shellui/cli
      <br />
      shellui init react
    </p>
    <Steps>
      <Step>
        <h2
          className="sui-dock"
          style={{
            position: 'absolute',
            left: 108,
            top: 360,
            margin: 0,
            fontSize: 132,
            fontWeight: 600,
            letterSpacing: '-0.045em',
            lineHeight: 0.95,
            ['--sui-y' as string]: '24px',
          }}
        >
          shellui start
        </h2>
      </Step>
      <Step>
        <p
          className="sui-dock"
          style={{
            position: 'absolute',
            left: 120,
            top: 560,
            margin: 0,
            fontSize: 32,
            ['--sui-y' as string]: '16px',
          }}
        >
          localhost:4000
        </p>
      </Step>
      <Step>
        <p
          className="sui-dock"
          style={{
            position: 'absolute',
            left: 120,
            bottom: 100,
            margin: 0,
            fontSize: 28,
            color: muted,
            ['--sui-y' as string]: '12px',
          }}
        >
          Or open playground.shellui.com. No install.
        </p>
      </Step>
    </Steps>
  </Stage>
);

function Caption({ title, command }: { title: string; command: string }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{title}</div>
      <div style={{ marginTop: 6, fontFamily: mono, fontSize: 22, color: muted }}>{command}</div>
    </div>
  );
}

function FileStack() {
  const sheet = (left: number, top: number, front: boolean): CSSProperties => ({
    position: 'absolute',
    left,
    top,
    width: 220,
    height: 140,
    boxSizing: 'border-box',
    borderRadius: 10,
    border: front ? '1.5px solid #111827' : `1.5px solid ${line}`,
    background: '#ffffff',
  });
  return (
    <div>
      <div style={{ position: 'relative', width: 300, height: 180 }}>
        <div style={sheet(0, 36, false)} />
        <div style={sheet(22, 18, false)} />
        <div style={sheet(44, 0, true)} />
      </div>
      <Caption title="dist/web" command="shellui build" />
    </div>
  );
}

function PreviewChip() {
  return (
    <div>
      <div
        style={{
          width: 360,
          border: '1.5px solid #111827',
          borderRadius: 18,
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${line}`,
          }}
        >
          <span
            style={{
              background: '#f9fafb',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 22,
            }}
          >
            *.shellui.app
          </span>
        </div>
        <div style={{ height: 72 }} />
      </div>
      <Caption title="shellui.app" command="shellui deploy" />
    </div>
  );
}

function DesktopWindow() {
  return (
    <div>
      <div
        style={{
          width: 320,
          height: 180,
          boxSizing: 'border-box',
          border: '1.5px solid #111827',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <div style={{ height: 36, background: '#111827' }} />
      </div>
      <Caption title="Tauri 2" command="shellui build --app" />
    </div>
  );
}

const Yours: Page = () => (
  <Stage>
    <p style={{ position: 'absolute', left: 120, top: 88, margin: 0, fontSize: 22, fontWeight: 600 }}>
      MIT
    </p>
    <h2
      style={{
        position: 'absolute',
        left: 112,
        top: 140,
        margin: 0,
        fontSize: 120,
        fontWeight: 600,
        letterSpacing: '-0.045em',
        lineHeight: 0.95,
      }}
    >
      Yours
      <br />
      to run.
    </h2>
    <Steps>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 120, top: 600, ['--sui-y' as string]: '24px' }}>
          <FileStack />
        </div>
      </Step>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 700, top: 560, ['--sui-y' as string]: '24px' }}>
          <PreviewChip />
        </div>
      </Step>
      <Step>
        <div className="sui-dock" style={{ position: 'absolute', left: 1240, top: 620, ['--sui-y' as string]: '24px' }}>
          <DesktopWindow />
        </div>
      </Step>
    </Steps>
    <p style={{ position: 'absolute', left: 124, top: 430, margin: 0, maxWidth: 760, fontSize: 28, lineHeight: 1.35, color: muted }}>
      Free to use, modify, and distribute.
      <br />
      Paid help is consulting, not a hosted plan.
    </p>
  </Stage>
);

const Close: Page = () => (
  <Stage wash>
    <div style={{ position: 'absolute', left: 120, top: 120 }}>
      <Wordmark height={72} />
    </div>
    <a
      href="https://shellui.com"
      style={{
        position: 'absolute',
        left: 108,
        top: 380,
        fontSize: 132,
        fontWeight: 600,
        letterSpacing: '-0.045em',
        lineHeight: 0.95,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      shellui.com
    </a>
    <p style={{ position: 'absolute', left: 120, bottom: 100, margin: 0, fontSize: 28, color: muted }}>
      <a href="https://docs.shellui.com" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
        docs.shellui.com
      </a>
      <span aria-hidden="true"> · </span>
      <a href="https://playground.shellui.com" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
        playground.shellui.com
      </a>
      <span aria-hidden="true"> · </span>
      <a href="https://github.com/shellui" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
        github.com/shellui
      </a>
    </p>
  </Stage>
);

export const notes: (string | undefined)[] = [
  `Open on the homepage line: ship sooner without rebuilding basic features. Shellui is the open-source web app development platform. The sentence is on shellui.com.`,
  `Let the copies land one at a time. Navigation, sign-in, administration, and files show up in every new app. Do not add a customer story. The site does not publish one.`,
  `The frame is the shell. The gold rectangle is the iframe, and the product stays in there. shellui.config.json holds navigation, backend, storage, hosting, and chrome. The SDK is how that iframe reaches dialogs, notifications, and settings.`,
  `Same shell, now with more than one app. Starters include react, vue, angular, and next, plus empty, nuxt, svelte, and alpine. Different frameworks, one interface.`,
  `Walk the pieces that dock: identity-service for OAuth and JWT, storage-service for files, /admin for members and access, shellui.app for a preview. The toast leaves the app and sits in the shell. That is the SDK, not a webhook. The site does not document webhooks or n8n. Auth and storage can point at Supabase. Admin still needs a Shellui identity backend. Previews expire after seven days unless you redeploy.`,
  `Read the two small commands, then shellui start. A new project listens on port 4000. You need Node.js 18 or newer. The short path with no install is playground.shellui.com. Docs live at docs.shellui.com.`,
  `shellui build writes static files to dist/web. Host them yourself. shellui deploy uploads a preview on shellui.app. shellui build --app needs Rust and writes a Tauri 2 wrapper under dist/app. MIT. Free to use, modify, and distribute. Paid help is architecture, custom work, and support. It is not a hosted plan and not a usage meter. Shellui cannot receive donations at this time.`,
  `Leave shellui.com up. Docs, the playground, and github.com/shellui are the next clicks. Do not add a roadmap.`,
];

export const meta: SlideMeta = {
  title: 'Shellui',
  createdAt: '2026-10-04T11:45:32Z',
};

export default [Title, Again, Shell, Apps, Services, Start, Yours, Close] satisfies Page[];
