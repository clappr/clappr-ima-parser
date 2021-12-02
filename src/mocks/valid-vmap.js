export const parsedVMAPMock = {
  "@xmlns:vmap": "http://www.iab.net/videosuite/vmap",
  "@version": "1.0",
  "vmap:AdBreak": [
    {
      "@timeOffset": "start",
      "@breakType": "linear",
      "@breakId": "preroll",
      "vmap:AdSource": {
        "@id": "preroll-ad-1",
        "@allowMultipleAds": "false",
        "@followRedirects": "true",
        "vmap:AdTagURI": {
          "@templateType": "vast3",
          "#cdata": "https://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&url=http://localhost:8080/&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&useragent=Mozilla/5.0+(Macintosh%3B+Intel+Mac+OS+X+10_15_7)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/96.0.4664.55+Safari/537.36,gzip(gfe)&vad_type=linear&vpos=preroll&pod=1&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6256&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0"
        }
      }
    },
    {
      "@timeOffset": "00:00:15.000",
      "@breakType": "linear",
      "@breakId": "midroll-1",
      "vmap:AdSource": {
        "@id": "midroll-1-ad-1",
        "@allowMultipleAds": "false",
        "@followRedirects": "true",
        "vmap:AdTagURI": {
          "@templateType": "vast3",
          "#cdata": "https://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&url=http://localhost:8080/&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&cue=15000&useragent=Mozilla/5.0+(Macintosh%3B+Intel+Mac+OS+X+10_15_7)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/96.0.4664.55+Safari/537.36,gzip(gfe)&vad_type=linear&vpos=midroll&pod=2&mridx=1&rmridx=1&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6256&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0"
        }
      }
    },
    {
      "@timeOffset": "end",
      "@breakType": "linear",
      "@breakId": "postroll",
      "vmap:AdSource": {
        "@id": "postroll-ad-1",
        "@allowMultipleAds": "false",
        "@followRedirects": "true",
        "vmap:AdTagURI": {
          "@templateType": "vast3",
          "#cdata": "https://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&url=http://localhost:8080/&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&useragent=Mozilla/5.0+(Macintosh%3B+Intel+Mac+OS+X+10_15_7)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/96.0.4664.55+Safari/537.36,gzip(gfe)&vad_type=linear&vpos=postroll&pod=3&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6256&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0"
        }
      }
    }
  ]
}