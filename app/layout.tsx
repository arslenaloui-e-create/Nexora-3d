import './globals.css';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Nexora 3D — Ingénierie 3D & impression haute précision',
  description: 'Conception 3D, ingénierie et impression 3D haute précision.',
};

const PAGE_CSS = String.raw`
:root{
  --bg:#030711;--bg-2:#050c17;--panel:#081525;--panel-2:#0b1b2d;--line:rgba(132,183,224,.14);
  --line-strong:rgba(0,169,255,.32);--text:#f5f9ff;--muted:#8fa5bc;--accent:#00a9ff;--accent-2:#20c4ff;
  --success:#41e3a3;--danger:#ff6680;--shadow:0 24px 70px rgba(0,0,0,.35);--radius:20px;--container:1180px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:92px}
body{margin:0;background:
 radial-gradient(circle at 75% 5%,rgba(0,169,255,.12),transparent 28rem),
 radial-gradient(circle at 8% 30%,rgba(26,83,148,.12),transparent 32rem),var(--bg);
 color:var(--text);font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.65;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(94,161,213,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(94,161,213,.035) 1px,transparent 1px);background-size:56px 56px;mask-image:linear-gradient(to bottom,black,transparent 78%)}
body.menu-open{overflow:hidden}
a{color:inherit;text-decoration:none}
button,input,textarea,select{font:inherit}
button{color:inherit}
img{max-width:100%;display:block}
.container{width:min(var(--container),calc(100% - 40px));margin-inline:auto}
.muted{color:var(--muted)}
.site-header{position:fixed;top:0;left:0;right:0;z-index:1000;border-bottom:1px solid transparent;background:rgba(3,7,17,.48);backdrop-filter:blur(16px);transition:.25s ease}
.site-header.scrolled{background:rgba(3,7,17,.9);border-color:var(--line);box-shadow:0 12px 40px rgba(0,0,0,.22)}
.nav-shell{height:76px;display:flex;align-items:center;gap:28px}
.brand{display:inline-flex;align-items:center;gap:11px;flex:0 0 auto}
.brand-mark{width:39px;height:39px;display:grid;place-items:center;border:1px solid rgba(32,196,255,.42);border-radius:12px;background:linear-gradient(145deg,rgba(0,169,255,.18),rgba(0,169,255,.03));color:var(--accent-2);box-shadow:0 0 26px rgba(0,169,255,.12)}
.brand-copy{display:grid;line-height:1}
.brand-copy strong{font-family:"Space Grotesk",sans-serif;letter-spacing:.12em;font-size:16px}
.brand-copy small{color:#7090ac;font-size:8px;letter-spacing:.2em;margin-top:5px}
.nav-links{display:flex;align-items:center;gap:25px;margin-left:auto}
.nav-links a{position:relative;color:#a9bbce;font-size:13px;font-weight:700;padding:27px 0;transition:.2s}
.nav-links a:hover,.nav-links a.active{color:#fff}
.nav-links a.active::after{content:"";position:absolute;left:0;right:0;bottom:16px;height:2px;border-radius:99px;background:var(--accent);box-shadow:0 0 12px var(--accent)}
.nav-actions{display:flex;align-items:center;gap:9px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:0 17px;border-radius:11px;border:1px solid transparent;font-size:12px;font-weight:800;letter-spacing:.01em;transition:transform .2s,box-shadow .2s,border-color .2s,background .2s}
.btn:hover{transform:translateY(-2px)}
.btn-primary{color:#00111c;background:linear-gradient(135deg,#36c9ff,#0098e7);box-shadow:0 10px 30px rgba(0,169,255,.2)}
.btn-primary:hover{box-shadow:0 14px 36px rgba(0,169,255,.32)}
.btn-secondary,.btn-ghost{background:rgba(255,255,255,.025);border-color:var(--line);color:#d8e7f4}
.btn-secondary:hover,.btn-ghost:hover{border-color:var(--line-strong);background:rgba(0,169,255,.07)}
.menu-toggle{display:none;width:42px;height:42px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.03);cursor:pointer}
main{position:relative}
.hero{min-height:760px;padding:145px 0 95px;display:flex;align-items:center}
.hero-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(330px,.85fr);gap:70px;align-items:center}
.badge,.eyebrow{display:inline-flex;align-items:center;gap:8px;color:#77d8ff;text-transform:uppercase;letter-spacing:.16em;font-size:10px;font-weight:800}
.badge{padding:8px 12px;border:1px solid rgba(0,169,255,.24);border-radius:999px;background:rgba(0,169,255,.06)}
.hero h1{font-family:"Space Grotesk",sans-serif;font-size:clamp(48px,6.1vw,82px);line-height:.99;letter-spacing:-.055em;margin:22px 0 24px;max-width:850px}
.hero h1 span{background:linear-gradient(110deg,#fff 15%,#5ad4ff 70%,#00a9ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{max-width:720px;color:#9db0c4;font-size:16px;line-height:1.85;margin:0}
.hero-actions{display:flex;gap:11px;flex-wrap:wrap;margin:30px 0 35px}
.metrics{display:flex;gap:34px;flex-wrap:wrap}
.metrics div{display:grid;gap:2px}
.metrics strong{font-family:"Space Grotesk";font-size:18px}
.metrics span{color:#6f879f;font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.glass{background:linear-gradient(145deg,rgba(13,31,50,.82),rgba(5,14,25,.76));border:1px solid var(--line);box-shadow:var(--shadow);backdrop-filter:blur(12px)}
.engine-card{border-radius:24px;padding:22px;position:relative;overflow:hidden}
.engine-card::before{content:"";position:absolute;width:180px;height:180px;border-radius:50%;background:rgba(0,169,255,.12);filter:blur(35px);top:25%;left:50%;transform:translate(-50%,-50%)}
.engine-top{display:flex;justify-content:space-between;align-items:center;color:#7f9ab2;font-size:11px;letter-spacing:.15em}
.engine-core{height:330px;display:grid;place-items:center;position:relative}
.engine-core::before,.engine-core::after{content:"";position:absolute;border:1px solid rgba(0,169,255,.18);border-radius:50%;width:230px;height:230px}
.engine-core::after{width:300px;height:300px;border-style:dashed;animation:spin 18s linear infinite}
.engine-core i{font-size:76px;color:var(--accent-2);filter:drop-shadow(0 0 26px rgba(0,169,255,.45));animation:float 4s ease-in-out infinite}
.specs{border-top:1px solid var(--line);display:grid;gap:0}
.spec{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid var(--line);font-size:11px}
.spec:last-child{border-bottom:0}.spec span{color:#6f879f}.spec strong{font-weight:700;text-align:right}
.section{padding:105px 0}
.section-title{max-width:760px;margin-bottom:42px}
.section-title h2{font-family:"Space Grotesk";font-size:clamp(30px,4vw,49px);line-height:1.08;letter-spacing:-.035em;margin:11px 0 13px}
.section-title p{color:var(--muted);max-width:690px;margin:0}
.cards-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.cards-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.card{border-radius:18px;padding:26px}
.cards-4 .card{min-height:215px}
.service-icon{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;color:var(--accent-2);background:rgba(0,169,255,.08);border:1px solid rgba(0,169,255,.18);margin-bottom:20px}
.card h3,.step h3{font-size:17px;margin:0 0 8px}.card p,.step p{color:#8ea5bb;font-size:13px;margin:0;line-height:1.7}
.card ul{margin:18px 0 24px;padding-left:18px;color:#a7bacb;font-size:12px;line-height:2}
.card .btn{margin-top:8px}
.process{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.step{position:relative;min-height:200px;border-radius:18px;padding:24px}
.step-num{font-family:"Space Grotesk";font-size:11px;color:var(--accent-2);letter-spacing:.12em;margin-bottom:34px}
.step:not(:last-child)::after{content:"";position:absolute;top:34px;right:-16px;width:31px;height:1px;background:linear-gradient(90deg,var(--accent),transparent);z-index:2}
.portfolio-heading{max-width:820px}
.portfolio-toolbar{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px;flex-wrap:wrap}
.portfolio-filters{display:flex;gap:7px;flex-wrap:wrap}
.filter{border:1px solid var(--line);background:rgba(255,255,255,.025);color:#8ea5bb;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:.2s}
.filter:hover{border-color:var(--line-strong);color:#dcecf8}
.filter.active{background:rgba(0,169,255,.12);border-color:rgba(0,169,255,.4);color:#7bdcff}
.filter-count{opacity:.6;margin-left:4px}
.portfolio-index{font-size:11px;color:#6f879f;text-transform:uppercase;letter-spacing:.12em}
.portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.portfolio-card{border-radius:18px;overflow:hidden;transition:transform .25s,border-color .25s,opacity .25s}
.portfolio-card:hover{transform:translateY(-5px);border-color:rgba(0,169,255,.27)}
.portfolio-card.is-hidden{display:none}
.portfolio-gallery{position:relative;aspect-ratio:16/10;overflow:hidden;background:linear-gradient(135deg,#07111e,#0b2034)}
.portfolio-slides{height:100%;position:relative}
.portfolio-image-button{display:none;position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;background:none;cursor:pointer}
.portfolio-image-button.is-active{display:block}
.portfolio-image-button img{width:100%;height:100%;object-fit:contain;transition:transform .6s,filter .4s}
.portfolio-card:hover .portfolio-image-button img{transform:scale(1.035)}
.portfolio-gallery::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(1,7,14,.75),transparent 45%);pointer-events:none}
.portfolio-project-no,.portfolio-gallery-count{position:absolute;z-index:3;top:12px;font-size:9px;letter-spacing:.13em;font-weight:800;color:#a9c1d7;background:rgba(2,8,15,.62);border:1px solid rgba(255,255,255,.08);padding:6px 8px;border-radius:7px}
.portfolio-project-no{left:12px}.portfolio-gallery-count{right:12px}
.portfolio-hover-label{position:absolute;left:14px;bottom:14px;z-index:3;display:flex;align-items:center;gap:8px;font-size:10px;color:#dff6ff;opacity:.0;transform:translateY(5px);transition:.25s}
.portfolio-card:hover .portfolio-hover-label{opacity:1;transform:none}
.gallery-arrow{position:absolute;z-index:4;top:50%;transform:translateY(-50%);width:31px;height:31px;border:1px solid rgba(255,255,255,.15);border-radius:50%;background:rgba(2,8,15,.7);color:#fff;cursor:pointer;opacity:0;transition:.2s}
.portfolio-gallery:hover .gallery-arrow{opacity:1}
.gallery-prev{left:10px}.gallery-next{right:10px}.gallery-arrow:disabled{opacity:.2!important;cursor:not-allowed}
.gallery-dots{position:absolute;z-index:4;right:12px;bottom:13px;display:flex;gap:4px}
.gallery-dot{width:5px;height:5px;border-radius:50%;border:0;background:rgba(255,255,255,.35);padding:0;cursor:pointer}.gallery-dot.active{background:#54d5ff;box-shadow:0 0 8px rgba(32,196,255,.8)}
.portfolio-info{padding:19px 20px 22px}.portfolio-meta{display:flex;justify-content:space-between;gap:10px;margin-bottom:9px;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
.portfolio-category{color:#65d4ff}.portfolio-code{color:#617b92;text-align:right}
.portfolio-info h3{font-size:16px;margin:0 0 7px}.portfolio-info p{color:#8097ad;font-size:11px;line-height:1.7;margin:0}
.faq{display:grid;gap:9px;max-width:900px}.faq-item{border-radius:14px;overflow:hidden}
.faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;text-align:left;background:transparent;border:0;padding:20px 22px;color:#dce9f4;font-weight:800;font-size:13px;cursor:pointer}
.faq-q i{color:#66d6ff;transition:transform .25s}.faq-item.open .faq-q i{transform:rotate(180deg)}
.faq-a{display:grid;grid-template-rows:0fr;padding:0 22px;color:#8ea5bb;font-size:12px;line-height:1.8;transition:grid-template-rows .25s,padding .25s}
.faq-a::after{content:"";min-height:0}.faq-item.open .faq-a{grid-template-rows:1fr;padding:0 22px 20px}
.faq-a{overflow:hidden}.faq-a{display:block;max-height:0;padding-top:0!important;padding-bottom:0!important;transition:max-height .25s,padding .25s}.faq-item.open .faq-a{max-height:240px;padding-bottom:20px!important}
.cta-card{position:relative;overflow:hidden}.cta-card::before{content:"";position:absolute;inset:auto -80px -130px auto;width:320px;height:320px;border-radius:50%;background:rgba(0,169,255,.12);filter:blur(40px);pointer-events:none}
.footer{margin-top:30px;padding:70px 0 24px;border-top:1px solid var(--line);background:rgba(2,7,14,.78)}
.footer-grid{display:grid;grid-template-columns:1.5fr .8fr .9fr 1.2fr;gap:45px}
.footer-brand-col p{max-width:350px;color:#738ba2;font-size:12px;line-height:1.8;margin:20px 0}
.footer-status{display:inline-flex;align-items:center;gap:8px;color:#7991a7;font-size:10px}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--success);box-shadow:0 0 10px rgba(65,227,163,.7)}
.footer-col{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.footer-col h3{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#d9e8f5;margin:0 0 7px}.footer-col a{color:#718aa1;font-size:11px;transition:.2s}.footer-col a:hover{color:#69d8ff}
.footer-contact a{display:flex;gap:9px;align-items:center}.footer-contact a i{width:15px;text-align:center;color:#55cef9}
.social-row{display:flex;gap:8px;margin-top:8px}.social-row a{width:33px;height:33px;display:grid;place-items:center;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.02)}
.footer-bottom{border-top:1px solid var(--line);margin-top:55px;padding-top:18px;display:flex;justify-content:space-between;gap:20px;color:#526a80;font-size:9px;text-transform:uppercase;letter-spacing:.08em}
.whatsapp-float{position:fixed;z-index:950;right:22px;bottom:22px;display:inline-flex;align-items:center;gap:9px;padding:11px 14px;border:1px solid rgba(65,227,163,.3);border-radius:999px;background:rgba(3,13,20,.88);color:#9ef2cf;box-shadow:0 12px 35px rgba(0,0,0,.3);backdrop-filter:blur(10px);font-size:11px;font-weight:800;transition:.2s}
.whatsapp-float:hover{transform:translateY(-3px);border-color:rgba(65,227,163,.6)}.whatsapp-float i{font-size:17px}
.portfolio-lightbox{position:fixed;inset:0;z-index:2000;display:none;padding:22px}.portfolio-lightbox.is-open{display:grid;place-items:center}
.lightbox-backdrop{position:absolute;inset:0;background:rgba(0,3,8,.88);backdrop-filter:blur(12px)}
.lightbox-shell{position:relative;z-index:2;width:min(1100px,100%);max-height:calc(100vh - 44px);display:grid;grid-template-rows:auto 1fr auto;gap:15px;padding:18px;border:1px solid rgba(118,181,224,.18);border-radius:20px;background:linear-gradient(145deg,#081522,#030913);box-shadow:0 40px 120px rgba(0,0,0,.6)}
.lightbox-top{display:flex;align-items:center;justify-content:space-between;gap:20px}.lightbox-kicker{color:#5ccfff;font-size:9px;letter-spacing:.15em;text-transform:uppercase}.lightbox-top h2{font:700 20px "Space Grotesk";margin:3px 0 0}.lightbox-tools{display:flex;align-items:center;gap:10px}.lightbox-counter{color:#7891a8;font-size:10px}
.icon-button{width:40px;height:40px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.03);display:grid;place-items:center;cursor:pointer}.icon-button:hover{border-color:var(--line-strong);color:#75dcff}
.lightbox-stage{min-height:0;display:grid;grid-template-columns:45px 1fr 45px;align-items:center;gap:10px}.lightbox-figure{min-height:0;margin:0;text-align:center}.lightbox-image-wrap{height:min(67vh,620px);display:grid;place-items:center;border:1px solid var(--line);border-radius:14px;background:#02070e;overflow:hidden}.lightbox-image-wrap img{width:100%;height:100%;object-fit:contain}.lightbox-figure figcaption{color:#8198ad;font-size:11px;padding-top:10px}.lightbox-arrow{justify-self:center}
.lightbox-dots{display:flex;justify-content:center;gap:5px;min-height:8px}.lightbox-dots button{width:6px;height:6px;padding:0;border:0;border-radius:50%;background:#34516a;cursor:pointer}.lightbox-dots button.active{background:#5dd8ff;box-shadow:0 0 9px rgba(0,169,255,.6)}
.scroll-progress{position:fixed;z-index:1100;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,#008ee0,#5fe1ff);box-shadow:0 0 10px rgba(0,169,255,.8);pointer-events:none}
:focus-visible{outline:2px solid #4bd3ff;outline-offset:3px}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes spin{to{transform:rotate(360deg)}}
@media (max-width:1050px){.nav-links{gap:16px}.nav-login{display:none}.hero-grid{gap:40px}.cards-4{grid-template-columns:repeat(2,1fr)}.portfolio-grid{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1.4fr 1fr 1fr;}.footer-contact{grid-column:2/-1}}
@media (max-width:800px){
  .container{width:min(var(--container),calc(100% - 28px))}.nav-shell{height:68px}.menu-toggle{display:grid;place-items:center}
  .nav-actions{margin-left:auto}.nav-cta{display:none}
  .nav-links{position:fixed;top:68px;left:14px;right:14px;margin:0;padding:10px;display:grid;gap:3px;background:rgba(4,11,19,.97);border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow);transform:translateY(-15px);opacity:0;visibility:hidden;transition:.2s}
  .site-header.menu-open .nav-links{transform:none;opacity:1;visibility:visible}.nav-links a{padding:13px 14px;border-radius:9px}.nav-links a:hover,.nav-links a.active{background:rgba(0,169,255,.07)}.nav-links a.active::after{display:none}
  .hero{min-height:auto;padding:125px 0 75px}.hero-grid{grid-template-columns:1fr}.engine-card{max-width:650px}.engine-core{height:260px}.section{padding:78px 0}.process{grid-template-columns:repeat(2,1fr)}.step:not(:last-child)::after{display:none}.footer-grid{grid-template-columns:1fr 1fr}.footer-contact{grid-column:auto}.footer-bottom{flex-direction:column}.lightbox-stage{grid-template-columns:38px 1fr 38px}
}
@media (max-width:560px){
  .hero h1{font-size:47px}.hero p{font-size:14px}.hero-actions .btn{width:100%}.metrics{gap:18px}.metrics div{min-width:88px}
  .cards-4,.cards-2,.process,.portfolio-grid{grid-template-columns:1fr}.cards-4 .card{min-height:auto}.portfolio-toolbar{align-items:flex-start}.portfolio-index{width:100%}
  .footer-grid{grid-template-columns:1fr;gap:30px}.footer-contact{grid-column:auto}.whatsapp-float{right:14px;bottom:14px}.whatsapp-float span{display:none}.whatsapp-float{width:48px;height:48px;padding:0;justify-content:center}
  .portfolio-lightbox{padding:8px}.lightbox-shell{max-height:calc(100vh - 16px);padding:12px;border-radius:15px}.lightbox-stage{grid-template-columns:32px 1fr 32px}.lightbox-image-wrap{height:58vh}.lightbox-top h2{font-size:17px}.lightbox-arrow{width:32px;height:32px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, settings] = await Promise.all([
    getSession(),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#030711" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path><polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline><line x1='12' y1='22.08' x2='12' y2='12'></line></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      </head>
      <body>
        <SiteNav session={session} logoPath={settings?.logoPath || '/logo.jpg'} />
        <div className="next-page-content">{children}</div>
      </body>
    </html>
  );
}
