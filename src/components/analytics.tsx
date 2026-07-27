import Script from 'next/script'
import { site } from '@/data/site'

export function AnalyticsScripts() {
  const { ga4Id, gtmId, directGa4Enabled } = site.analytics

  return (
    <>
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});try{var raw=localStorage.getItem('sindikat_cookie_consent');if(raw){var c=JSON.parse(raw);var granted=c&&c.choice==='accepted';gtag('consent','update',{analytics_storage:granted?'granted':'denied',ad_storage:granted?'granted':'denied',ad_user_data:granted?'granted':'denied',ad_personalization:granted?'granted':'denied'})}}catch(e){}`}
      </Script>
      {gtmId ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {directGa4Enabled && ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:false,allow_google_signals:false});`}
          </Script>
        </>
      ) : null}
    </>
  )
}

export function GoogleTagManagerNoScript() {
  if (!site.analytics.gtmId) return null
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${site.analytics.gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" />
    </noscript>
  )
}
