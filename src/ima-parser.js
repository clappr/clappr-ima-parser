import { CorePlugin, Log, version } from '@clappr/core'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'

export default class IMAParserPlugin extends CorePlugin {
  get name() { return 'ima_parser' }

  get supportedVersion() { return { min: version } }

  constructor(core) {
    super(core)
    this._VMAPHandler = new VMAPManager()
    this._VASTHandler = new VASTManager()

    // Globo VMAP (don't respect IAB spec)
    // this.url = 'https://pubads.g.doubleclick.net/gampad/ads?sz=1280x720&iu=%2F95377733%2Ftvg_G1%2FJornal_Nacional&cmsid=11413&vid=9831539&cust_params=tvg_pgStr%3Dg1%2Fjornal_nacional%2Fvideos%26tvg_cma%3Dg1%2Cjornal_nacional%2Cvideos%26tvg_pgTipo%3DGloboPlay%26tvg_pgName%3DGloboPlay%26gp_platform%3Dweb%26glb_tipo%3Dnao-assinante%26glb_id%3D5d5c6b2c-3062-4947-ba49-8d6a520d7abf%26service_id%3D4654%26ogncluster%3Dvdftm2w3c%2Cv4xhhj0fz%2Crqolfr3v3%2Cuhhzkeo8h%2Culbrzgm4o%2Cr60vrxt3b%2Csksmqpsa7%2Cr9y870ivy%2Curim4twyb%2Csp7s8dcfs%2Cuv53zslfl%2Csjf8j14wx%2Cqou66o7zu%2Cs3nqr6gtw%2Ctr07w9zvo%2Cuxcm7duzg%2Cv5zxiga97%2Cwaf59nn2q%2Csu02jiqj1%2Cue60pvu46%2Cthes4ok1e%2Cwjwphekqj%2Ctgm8visz9%2Ctgm8q0oug%2Cwajhty737%2Ctvghfgc9v%2Cuxde6hzug%2Cuw9r9dm4n%2Cvlmqnhtez%2Cuysz8qnfd%2Cwaf6eb8em%2Cvnkypr0fv%2Cwl3pkq740%2Ct9655qlna%2Cth2sn8d97%2Cuv9zn4fle%2Cwfeacm9aq%2Cwjwodbz1w%2Cwl4bg9kd6%2Cs5qa5fd10%2Crqsqab4ou%2Csspwomone%2Ctvgh1vgfv%2Cuguek9zlt%2Cuxdhyyest%2Cr1lmg2tr9%2Cthyn81ol7%2Cvnkysies8%2Cs9ub3f1gu%2Cv4xfqgslb%2Cslon2j84e%2Cwl23mpb08%2Crtcqrezwe%2Ctgmz9g7ky%2Cuktbp810n%2Ctgmqxw422%2Cv50o4jmab%2Cvh6ua2d4m%2Crxvgktubg%2Cr9zbdq2k4%2Cvbkgflgwj%2Cvvnp5zpfc%2Cq72jxxn9l%2Crl6nks3qo%2Cuxcqxsxxo%2Cvfe4uhi97%2Ct5xn5ub50%2Cv45hc3189%2Ctvj37wpy6%2Cupjqdh2xq%2Crl6p00hbr%2Ctxu72yzyg%2Cueuep7ss9%2Cv4xl077xt%2Ctkqpw5u8e%2Cuf2mfl0br%2Cv45ffe46s%2Cv7j8r3lcg%2Ctgyxl3e1q%2Cq0g69luhs%2Cv9nhf9wwi%2Cr9y9ntemu%2Cuxcrk8bmc%2Ctgiufarai%2Cv45gosycz%2Cwlcpvqslg%2Cthzs8jjgc%2Cs5vgyggc5%2Ct9e4e78jw%2Ctgm8z1eyi%2Cwkcme6o87%2Cvlmvm4lki%2Cr9y8arfke%2Cuhhzkg3t1%2Cv45gb2y9w%2Ctvghhxbdr%2Cs3fzrirdt%2Cuw9m2d6kf%2Cv5s6k0m5v%2Cupipepvq2%2Cqou93ocxx%2Cu9p74f28a%2Cthbyqxsy7%2Cs655fg8hf%2Ctgxvf19dg%2Crqsqe3tod%2Ctfrkkk5ze%2Cv50oalr8b%2Cs655aoecm%2Ctw3durksk%2Ctggbupwbl%2Cv45g8vxxr%2Cuz7mfsnou%2Cwl3mhxput%2Cs9hhzvawx%2Cv45hmupcz%2Cs654mng69%2Cvagyc9sjd%2Cs5zhzvari%2Cuw9rud80g%2Cv4xkb5tno%2Ctvj11yc20%2Crqplbmpyu%2Cqou9o7c84%2Cuhxfzuvu2%2Cv45hgcece%2Ct9st3kq9j%2Cv4xituplg%2Cv5z5bvwfl%2Cs5qcv39qo%2Ctrzraxzpb%2Cs5qbtyz3k%2Ctvgglq7kl%2Cv45hutxf9%2Cv45f8aoyj%2Cv45ijpwvy%2Cr1lmopqy1%2Cuxco0v2c5%2Cuklwgag7k%2Cs5u3kflrc%2Cwh5htm0ee%2Cv67wq2zu3%2Cwfd94xvd1%2Cwjwmr5ier%2Cuxclrorew%2Ctvgjpn9xy%2Cuw0jteiyg%2Cq130ubhh9%2Cv20sn04vq%2Cuhhzkdbiz%2Curtuxj5q8%2Ctgyxqd4h2%2Cuzg9gkumo%2Cv7bw2ibx9%2Cq1310u9zg%2Cv45ea1n35%2Cuz4t60vvt%2Cvgb8fvtns%2Cwfxvtsw3v%2Cuv56u3et0%2Crqono84qu%2Cum7cbydzu%2Cqsyxdwji6%2Ctgi7au23t%2Cvbos236yi%2Cuumf6almd%2Cv2x4zbtwc%2Cufabs5lrj%2Cuhhzkl0yj%2Cvqllakjao%2Csu02zy3tn%2Cv45iafy6p%2Cuxxfmmiuy%2Cwi88n3a1j%2Cwlv5mzo7r%2Cqovbar2im%2Cplntbeta%26kuid%3Dk1pidff_kppid_3582146226242205139118%26user_service_id%3D4654%26gp_playlist%3Dundefined%26video_subscription%3Dtrue%26nvg_gender%3D1%26nvg_age%3D3%26nvg_income%3D1%26ognCluster%3Dvdftm2w3c%2Cv4xhhj0fz%2Crqolfr3v3%2Cuhhzkeo8h%2Culbrzgm4o%2Cr60vrxt3b%2Csksmqpsa7%2Cr9y870ivy%2Curim4twyb%2Csp7s8dcfs%2Cuv53zslfl%2Csjf8j14wx%2Cqou66o7zu%2Cs3nqr6gtw%2Ctr07w9zvo%2Cuxcm7duzg%2Cv5zxiga97%2Cwaf59nn2q%2Csu02jiqj1%2Cue60pvu46%2Cthes4ok1e%2Cwjwphekqj%2Ctgm8visz9%2Ctgm8q0oug%2Cwajhty737%2Ctvghfgc9v%2Cuxde6hzug%2Cuw9r9dm4n%2Cvlmqnhtez%2Cuysz8qnfd%2Cwaf6eb8em%2Cvnkypr0fv%2Cwl3pkq740%2Ct9655qlna%2Cth2sn8d97%2Cuv9zn4fle%2Cwfeacm9aq%2Cwjwodbz1w%2Cwl4bg9kd6%2Cs5qa5fd10%2Crqsqab4ou%2Csspwomone%2Ctvgh1vgfv%2Cuguek9zlt%2Cuxdhyyest%2Cr1lmg2tr9%2Cthyn81ol7%2Cvnkysies8%2Cs9ub3f1gu%2Cv4xfqgslb%2Cslon2j84e%2Cwl23mpb08%2Crtcqrezwe%2Ctgmz9g7ky%2Cuktbp810n%2Ctgmqxw422%2Cv50o4jmab%2Cvh6ua2d4m%2Crxvgktubg%2Cr9zbdq2k4%2Cvbkgflgwj%2Cvvnp5zpfc%2Cq72jxxn9l%2Crl6nks3qo%2Cuxcqxsxxo%2Cvfe4uhi97%2Ct5xn5ub50%2Cv45hc3189%2Ctvj37wpy6%2Cupjqdh2xq%2Crl6p00hbr%2Ctxu72yzyg%2Cueuep7ss9%2Cv4xl077xt%2Ctkqpw5u8e%2Cuf2mfl0br%2Cv45ffe46s%2Cv7j8r3lcg%2Ctgyxl3e1q%2Cq0g69luhs%2Cv9nhf9wwi%2Cr9y9ntemu%2Cuxcrk8bmc%2Ctgiufarai%2Cv45gosycz%2Cwlcpvqslg%2Cthzs8jjgc%2Cs5vgyggc5%2Ct9e4e78jw%2Ctgm8z1eyi%2Cwkcme6o87%2Cvlmvm4lki%2Cr9y8arfke%2Cuhhzkg3t1%2Cv45gb2y9w%2Ctvghhxbdr%2Cs3fzrirdt%2Cuw9m2d6kf%2Cv5s6k0m5v%2Cupipepvq2%2Cqou93ocxx%2Cu9p74f28a%2Cthbyqxsy7%2Cs655fg8hf%2Ctgxvf19dg%2Crqsqe3tod%2Ctfrkkk5ze%2Cv50oalr8b%2Cs655aoecm%2Ctw3durksk%2Ctggbupwbl%2Cv45g8vxxr%2Cuz7mfsnou%2Cwl3mhxput%2Cs9hhzvawx%2Cv45hmupcz%2Cs654mng69%2Cvagyc9sjd%2Cs5zhzvari%2Cuw9rud80g%2Cv4xkb5tno%2Ctvj11yc20%2Crqplbmpyu%2Cqou9o7c84%2Cuhxfzuvu2%2Cv45hgcece%2Ct9st3kq9j%2Cv4xituplg%2Cv5z5bvwfl%2Cs5qcv39qo%2Ctrzraxzpb%2Cs5qbtyz3k%2Ctvgglq7kl%2Cv45hutxf9%2Cv45f8aoyj%2Cv45ijpwvy%2Cr1lmopqy1%2Cuxco0v2c5%2Cuklwgag7k%2Cs5u3kflrc%2Cwh5htm0ee%2Cv67wq2zu3%2Cwfd94xvd1%2Cwjwmr5ier%2Cuxclrorew%2Ctvgjpn9xy%2Cuw0jteiyg%2Cq130ubhh9%2Cv20sn04vq%2Cuhhzkdbiz%2Curtuxj5q8%2Ctgyxqd4h2%2Cuzg9gkumo%2Cv7bw2ibx9%2Cq1310u9zg%2Cv45ea1n35%2Cuz4t60vvt%2Cvgb8fvtns%2Cwfxvtsw3v%2Cuv56u3et0%2Crqono84qu%2Cum7cbydzu%2Cqsyxdwji6%2Ctgi7au23t%2Cvbos236yi%2Cuumf6almd%2Cv2x4zbtwc%2Cufabs5lrj%2Cuhhzkl0yj%2Cvqllakjao%2Csu02zy3tn%2Cv45iafy6p%2Cuxxfmmiuy%2Cwi88n3a1j%2Cwlv5mzo7r%2Cqovbar2im%2Cplntbeta%26kuid%3Dk1pidff_kppid_3582146226242205139118&ciu_szs=940x360&gdfp_req=1&env=vp&output=xml_vast4&unviewed_position_start=1&url=https%3A%2F%2Fgloboplay.globo.com%2Fv%2F9831539%2Fprograma%2F%3Fs%3D0s&description_url=%5Bdescription_url%5D&correlator=4113822413341263&pp=Desktop&sdkv=h.3.478.2&osd=2&frm=0&vis=1&sdr=1&hl=en&afvsz=450x50%2C468x60%2C480x70&is_amp=0&u_so=l&ctv=0&sdki=44d&adk=84834231&sdk_apis=2%2C8&sid=39C7DBE8-8790-4ED8-89C0-D265AAD86E1A&eid=44730612&dt=1630958398109&cookie=ID%3Df4965bcf9dd703f8%3AT%3D1627941707%3AS%3DALNI_MbsmXJP8eIZZL45xMu0X0zhx7flvQ&scor=1344789081329338&ppid=c89c1c6724f5378c2ba7faebeee51f18aa8005a94dc5a8ca943a33b32c918292&ged=ve4_td400_tt384_pd400_la4000_er0.0.154.300_vi0.0.824.1249_vp100_ts122_eb24171'

    // IMA VMAP sample (respect IAB spec)
    this.url = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator='
  }

  /**
   * Get a list of AdBreaks from the received URL.
   * @param {String} url Ad Server URL to fetch VMAP XML.
   * @returns {Promise} Promise resolved with one array of AdBreaks or one error.
   */
  requestAdBreaks(url = this.url) {
    return this._VMAPHandler.request(url)
      .then(xmlPlainText => this._VMAPHandler.process(xmlPlainText))
      .then(rawAdBreak => this._VMAPHandler.filterRawData(rawAdBreak))
      .then(adBreaks => {
        Log.info(this.name, 'Available adBreaks: ', adBreaks)
        return adBreaks
      })
      .catch(error => {
        Log.error(this.name, 'Fail to request VMAP: ', error)
        return Promise.reject(error)
      })
  }

  /**
   * Get a list of ads available from the received AdBreak.
   * @param {Object} adBreak An adBreak entity.
   * @returns {Promise} Promise resolved with one array of current available ads of the respected AdBreak.
   */
  requestAd(adBreak) {
    return this._VASTHandler.request(adBreak.adTag)
      .then(ad => {
        adBreak.addAd(ad)
        Log.info('AdBreak', 'Added to ads list: ', adBreak.ads[adBreak.ads.length - 1])
        return adBreak.ads
      })
      .catch(error => Promise.reject(error))
  }
}
