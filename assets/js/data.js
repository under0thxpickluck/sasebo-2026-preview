/* ============================================================
   SASEBO LIGHTS FESTIVAL 2026 — サイト内容データ（簡易CMS）
   ------------------------------------------------------------
   ここを書き換えるだけでサイト全体の表示が変わります。
   キー名は仕様書 24章 Data Model に合わせてあるため、
   将来 API(26章) / 管理画面(23章) に接続する際もそのまま移行できます。

   ★ が付いた項目は未確定です。決定後に必ず更新してください。
   ============================================================ */

window.SCM = {

  /* -------- サイト共通 -------- */
  site: {
    nameEn: "SASEBO LIGHTS FESTIVAL",
    year: "2026",
    nameJp: "SASEBO LIGHTS FESTIVAL 2026",
    tagline: "佐世保の冬に、あかりを。",
    genres: ["CHRISTMAS MARKET", "FOOD & MARCHE", "ILLUMINATION"],
    venueEn: "at SASEBO KEIRIN",
    contactEmail: "★info@example.jp",          // ★お問い合わせ先
    organizer: "★実行委員会名を記入",           // ★主催
    sampleNotice: "写真はイメージです。出店者および協賛の一覧は、準備中のサンプルを表示しています。"
  },

  /* -------- ヘッダー右上の固定ボタン（2行） -------- */
  headerCta: {
    sub: "冬花火サポーター",
    main: "1,000円から受付中",
    url: "support.html"
  },

  /* -------- 開催情報（仕様書 24章 event） -------- */
  event: {
    status: "before",                 // before | today | after
    fireworksStatus: "scheduled",     // scheduled | canceled
    dateLabel: "2026年12月19日（土）", // ★正式開催日
    dateShort: "2026.12.19",
    dateConfirmed: false,             // ★日程確定後 true に。false の間は「調整中」注記を表示
    targetISO: "2026-12-19T19:30:00+09:00", // ★カウントダウン基準（花火開始時刻）
    openLabel: "11:00 - 20:30",
    fireworksTime: "20:00",           // ★花火打ち上げ時刻
    venue: "佐世保競輪場",
    venueAddress: "★長崎県佐世保市（正式住所を記入）",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=%E4%BD%90%E4%B8%96%E4%BF%9D%E7%AB%B6%E8%BC%AA%E5%A0%B4",
    admission: "入場無料"
  },

  /* -------- 緊急告知バナー（仕様書 15章） -------- */
  emergency: {
    show: true,
    level: "info",                    // info | warning | critical
    tag: "NOTICE",
    text: "開催日および冬花火の打ち上げ時刻は調整中です。決定次第、当サイトでお知らせします。",
    linkText: "お知らせ",
    linkUrl: "news.html"
  },

  /* -------- 冬花火 支援メーター（仕様書 7章） -------- */
  funding: {
    goalAmount: 2000000,
    currentAmount: 1420000,           // 入金を確認できた金額のみ（サーバー側集計を想定）
    nextGoal: 2500000,
    supporterCount: 143,
    companyCount: 27,
    updatedAt: "2026.08.20",
    useOfFunds: "冬花火の打ち上げ費用を中心に、会場の安全対策、通路や照明の整備、広報にあてます。"
  },

  /* -------- 当日の時間割 -------- */
  timeline: [
    {
      time: "11:00",
      en: "MARKET",
      title: "マルシェとキッチンカー",
      text: "飲食と物販が並びます。県北を中心とした事業者に出店いただきます。夕方までに売り切れる店もありますので、お目当てがある場合は早めのご来場をおすすめします。",
      img: "assets/img/photo/market.jpg",
      alt: "灯りに照らされたマルシェのブースと来場者",
      link: "market.html",
      linkText: "出店者一覧"
    },
    {
      time: "16:30",
      en: "ILLUMINATION",
      title: "点灯",
      text: "照明を入れるのは、入口、通路、フォトスポット、観覧席です。会場全体を飾り立てることはしません。この時間帯から来場者が増えます。",
      img: "assets/img/photo/light.jpg",
      alt: "会場中央に立つメインツリーと暖色の照明",
      link: "about.html",
      linkText: "イベントについて"
    },
    {
      time: "20:00",
      en: "FIREWORKS",
      title: "冬花火",
      text: "バンクの向こう側に打ち上げます。正面の観覧席のみ有料とし、その売上と協賛で打ち上げ費用にあてます。",
      img: "assets/img/photo/fireworks.jpg",
      alt: "佐世保競輪場のバンク越しに上がる冬花火",
      link: "fireworks.html",
      linkText: "冬花火について"
    }
  ],

  /* -------- 指標（仕様書 12章） -------- */
  figures: [
    { label: "来場目標", value: "5,000", unit: "人" },
    { label: "出店予定", value: "50-60", unit: "店" },
    { label: "冬花火 目標支援額", value: "200", unit: "万円" },
    { label: "入場料", value: "0", unit: "円" }
  ],

  /* -------- ご来場にあたっての注意事項 -------- */
  notices: {
    title: "ご来場にあたって",
    items: [
      "雨天決行です。荒天の場合は中止となることがあります。開催可否は前日または当日午前に判断し、当サイトとSNSでお知らせします。",
      "風の状況により、冬花火のみ中止となる場合があります。その場合もマルシェは営業します。",
      "会場内は一部未舗装です。歩きやすい靴でお越しください。",
      "会場内での火気の使用および持ち込みは禁止です。",
      "会場内で撮影した映像・写真を、広報のために使用する場合があります。予めご了承ください。",
      "花火終了後は出口および周辺道路の混雑が予想されます。お時間に余裕をもってお帰りください。"
    ]
  },

  /* -------- 出店者（仕様書 24章 vendor / サンプル） -------- */
  vendorCategories: [
    { key: "all",   label: "すべて" },
    { key: "food",  label: "キッチンカー" },
    { key: "market",label: "マルシェ" },
    { key: "local", label: "県北の物産" }
  ],
  vendors: [
    { name:"灯り珈琲",           cat:"food",   catLabel:"キッチンカー", area:"佐世保市", local:true,  img:"assets/img/photo/vendor-01.jpg", desc:"焙煎したての豆で淹れるドリップコーヒーと、冬季限定のスパイスラテをご用意します。" },
    { name:"PIZZERIA NAPOLI 佐世保", cat:"food", catLabel:"キッチンカー", area:"佐世保市", local:true, img:"assets/img/photo/vendor-04.jpg", desc:"車載の窯で焼くナポリピッツァ。1枚を切り分けてお渡しします。" },
    { name:"SASEBO GRILL BURGER", cat:"food",  catLabel:"キッチンカー", area:"佐世保市", local:true,  img:"assets/img/photo/vendor-07.jpg", desc:"ご注文を受けてから焼き上げます。混雑時は整理券をお配りします。" },
    { name:"みかん山ホットスタンド", cat:"food", catLabel:"キッチンカー", area:"佐世保市", local:true, img:"assets/img/photo/vendor-09.jpg", desc:"ホットチョコレート、ホットサイダー、県産みかんのホットジュース。甘さ控えめもご用意します。" },
    { name:"はまゆう食堂",       cat:"food",   catLabel:"キッチンカー", area:"佐世保市", local:true,  img:"assets/img/photo/vendor-05.jpg", desc:"地元の魚と野菜を使った汁物とごはん。ご家族で分けやすい量でご提供します。" },
    { name:"九十九ベーカリー",   cat:"market", catLabel:"マルシェ",   area:"佐世保市", local:true,  img:"assets/img/photo/vendor-02.jpg", desc:"県産小麦のパンと、この日限定のシュトーレン。夕方までに完売する場合があります。" },
    { name:"北松 農園マルシェ",  cat:"local",  catLabel:"県北の物産", area:"北松浦郡", local:false, img:"assets/img/photo/vendor-08.jpg", desc:"冬野菜と柑橘、加工品の直売です。生産者が売り場に立ちます。" },
    { name:"ゆのき菓子店",       cat:"market", catLabel:"マルシェ",   area:"佐世保市", local:true,  img:"assets/img/photo/vendor-10.jpg", desc:"焼き菓子とホットチョコレート。手土産用の箱入りもご用意します。" },
    { name:"雑貨店 みなと",      cat:"market", catLabel:"マルシェ",   area:"佐世保市", local:true,  img:"assets/img/photo/vendor-06.jpg", desc:"手仕事の雑貨とキャンドル。メインツリーの正面に出店します。" },
    { name:"石岳ハーブ園",       cat:"market", catLabel:"マルシェ",   area:"佐世保市", local:true,  img:"assets/img/photo/vendor-03.jpg", desc:"ハーブティーとリース。リースづくりの小さな体験卓を設けます。" },
    { name:"平戸 海のもの",      cat:"local",  catLabel:"県北の物産", area:"平戸市",   local:false, img:"assets/img/photo/vendor-11.jpg", desc:"干物・練り物の実演販売です。試食をご用意します。" },
    { name:"うつわと道具 波佐見", cat:"local", catLabel:"県北の物産", area:"東彼杵郡", local:false, img:"assets/img/photo/vendor-12.jpg", desc:"日常使いの器と台所道具。贈り物向けの小さなサイズを中心に並べます。" }
  ],

  /* -------- 有料観覧席（仕様書 10章 / 24章 ticket_type） -------- */
  tickets: [
    { name:"一般指定席", price:2000, unit:"1名", capacity:400, sold:212, feature:false,
      value:["冬花火の正面に1席","当日中は再入場可","荒天中止の場合は全額返金"] },
    { name:"ペアシート",  price:5000, unit:"2名", capacity:120, sold:96,  feature:true,
      value:["2席を並びでご用意","ひざ掛けの貸し出し付き","ドリンク引換券2枚"] },
    { name:"VIP TABLE",  price:15000, unit:"4名", capacity:30,  sold:28,  feature:false,
      value:["4名用のテーブル席","専用入場口・専用トイレ","ドリンク引換券4枚"] },
    { name:"企業席",     price:30000, unit:"4-6名", capacity:20, sold:20, feature:false,
      value:["4〜6名用の区画","社名の掲示（希望制）","当日は担当がご案内します"] }
  ],
  ticketNote: "販売開始日は決定次第、当サイトでお知らせします。",

  /* -------- 個人支援プラン（仕様書 8.1） -------- */
  supportPlans: [
    { name:"花火応援",   price:1000,  feature:false, items:["冬花火の打ち上げ費用にあてます","支援者数に加算します"] },
    { name:"サポーター", price:3000,  feature:true,  items:["記念品をお送りします","ご希望の方はお名前を掲載します","ご住所をお伺いするのはこのプランからです"] },
    { name:"プレミアム", price:10000, feature:false, items:["一般指定席を2席お渡しします","記念品をお送りします","ご希望の方はお名前を掲載します"] },
    { name:"自由金額",   price:null,  feature:false, items:["1,000円以上でご指定ください","使途は花火、安全対策、会場整備、広報です"] }
  ],

  /* -------- 企業協賛枠（仕様書 8.3） --------
     sponsors: その枠が決まった企業・団体名。空配列のあいだは表に「募集中」と表示します。
               決定したら ["★★株式会社"] のように社名を追加してください。 */
  sponsorTiers: [
    { tier:"MAIN",     price:1000000, limit:"1社限定", items:["イベント名に社名を冠します","ロゴを最上位で掲出します","会場アナウンスでご紹介します","ブースを出展いただけます"], sponsors:[] },
    { tier:"PREMIUM",  price:500000,  limit:"",        items:["ロゴを大きく掲出します","ブースを出展いただけます","VIP席にご招待します"], sponsors:[] },
    { tier:"REGIONAL", price:300000,  limit:"",        items:["ブースを出展いただけます","VIP席にご招待します","当サイトで事業をご紹介します"], sponsors:[] },
    { tier:"OFFICIAL", price:100000,  limit:"",        items:["ロゴを掲出します","招待席をお渡しします"], sponsors:[] },
    { tier:"LOCAL",    price:30000,   limit:"オンライン申込可", items:["協賛一覧にお名前を掲載します"], sponsors:[] },
    { tier:"SHOP",     price:10000,   limit:"オンライン申込可", items:["地域MAPに掲載します","クーポンを掲載いただけます"], sponsors:[] }
  ],

  /* -------- メッセージ花火（仕様書 9章） -------- */
  messageFirework: {
    price: 10000,
    titleLimit: 20,
    bodyLimit: 50,
    deadline: "開催の14日前",
    note: "打ち上げ前の会場アナウンスとスクリーンでご紹介する枠です。特定の1発を指定できるものではありません。"
  },

  /* -------- 協賛（仕様書 13章 / サンプル） --------
     logo:  ロゴを掲出する上位の枠
     names: ロゴなしでお名前のみ掲載する企業・団体（参考サイトと同じ二段構え）
  */
  partners: {
    main:    [],   // 決定したら { name, logo, url } を追加してください
    premium: [
      { name:"PARTNER 02", logo:"assets/img/logo/partner-02.svg", url:"#" },
      { name:"PARTNER 03", logo:"assets/img/logo/partner-03.svg", url:"#" }
    ],
    regional:[
      { name:"PARTNER 04", logo:"assets/img/logo/partner-04.svg", url:"#" },
      { name:"PARTNER 05", logo:"assets/img/logo/partner-05.svg", url:"#" },
      { name:"PARTNER 06", logo:"assets/img/logo/partner-06.svg", url:"#" }
    ],
    local:   [
      { name:"PARTNER 07", logo:"assets/img/logo/partner-07.svg", url:"#" },
      { name:"PARTNER 08", logo:"assets/img/logo/partner-08.svg", url:"#" }
    ],
    /* お名前のみ掲載する協賛。決定した企業・団体名を五十音順で追加してください */
    names: [],
    namesNote: "※五十音順",
    namesEmpty: "協賛企業・団体は決定次第、五十音順で掲載します。",
    individual: ["匿名希望", "佐世保市 M.K", "早岐 T.S", "匿名希望", "佐世保市 Y.N", "匿名希望"]
  },

  /* -------- 主催・後援・協力 -------- */
  credits: [
    { label: "主催",   value: "★実行委員会名" },
    { label: "共催",   value: "★" },
    { label: "後援",   value: "★" },
    { label: "協力",   value: "★" },
    { label: "会場協力", value: "★" }
  ],

  /* -------- 実行委員会 -------- */
  committee: [
    { role: "実行委員長", name: "★" },
    { role: "副実行委員長", name: "★" },
    { role: "事務局長", name: "★" },
    { role: "会計", name: "★" },
    { role: "出店担当", name: "★" },
    { role: "協賛担当", name: "★" },
    { role: "広報担当", name: "★" }
  ],

  /* -------- 佐世保について（出典を明記して掲載） -------- */
  region: [
    { label: "佐世保市の人口", value: "約22.4万人", note: "2026年7月1日時点の推計人口" },
    { label: "年間観光客数",   value: "延べ約519.6万人", note: "令和6年" }
  ],
  regionSource: "出典：佐世保市の公表資料にもとづく数値です。詳細は事業計画書に記載しています。",

  /* -------- お知らせ（仕様書 15章 / サンプル） -------- */
  news: [
    { date:"2026.08.20", cat:"PARTNER",  title:"協賛の募集を開始しました",
      body:"MAIN / PREMIUM / REGIONAL の各枠について、資料の送付とご相談を受け付けています。" },
    { date:"2026.08.12", cat:"MARKET",   title:"出店の募集要項を公開しました",
      body:"飲食・物販あわせて50〜60店を予定しています。佐世保市内および県北の事業者から順にご案内します。" },
    { date:"2026.08.01", cat:"EVENT",    title:"開催計画を公開しました",
      body:"佐世保競輪場を会場に、入場無料のマーケットと冬花火を実施します。" },
    { date:"2026.07.24", cat:"IMPORTANT",title:"開催日は調整中です",
      body:"関係機関と調整しています。確定していない日程を当サイトに掲載することはありません。" }
  ],

  /* -------- よくある質問（仕様書 16章） -------- */
  faq: [
    { cat:"開催", q:"雨天でも開催しますか。", a:"雨天決行です。荒天が見込まれる場合は前日または当日午前に開催可否を判断し、当サイトのトップとSNSでお知らせします。" },
    { cat:"花火", q:"冬花火が中止になった場合はどうなりますか。", a:"風の状況により、花火のみ中止となる場合があります。その場合、有料観覧席は規約に沿って返金します。マルシェは通常どおり営業します。" },
    { cat:"料金", q:"入場料はかかりますか。", a:"入場は無料です。費用がかかるのは、冬花火の有料観覧席、飲食・物販のご購入、任意のご支援のみです。" },
    { cat:"席",   q:"チケットの返金条件を教えてください。", a:"荒天による中止、および花火のみの中止の場合は全額返金します。お客様都合による返金は、販売ページに記載する期限までとします。" },
    { cat:"交通", q:"駐車場はありますか。", a:"台数および場所は決定次第、当サイトに掲載します。確定していない臨時駐車場の情報は掲載しません。公共交通機関のご利用をおすすめします。" },
    { cat:"子連れ", q:"ベビーカーで来場できますか。", a:"ご通行いただけます。花火の時間帯は混雑しますので、観覧エリアの外周に一時置き場を設ける予定です。" },
    { cat:"飲食", q:"飲食物の持ち込みはできますか。", a:"お子さま用の飲食物と水筒はお持ち込みいただけます。火気を使用するものは、持ち込みも使用も禁止です。" },
    { cat:"協賛", q:"個人でも支援できますか。", a:"できます。1,000円からのプランをご用意しています。お名前の掲載は任意で、匿名でのご支援も承ります。" },
    { cat:"協賛", q:"支援金は何に使われますか。", a:"冬花火の打ち上げ費用を中心に、会場の安全対策、通路や照明の整備、広報にあてます。全額を花火のみに使用するものではありません。" },
    { cat:"出店", q:"出店したいのですが、どうすればよいですか。", a:"出店募集の窓口までご連絡ください。佐世保市内および県北の事業者から順にご案内しています。" }
  ],

  /* -------- アクセス（仕様書 14章） -------- */
  access: {
    transit: [
      { label:"JR",     text:"JR佐世保駅からバスまたはタクシーをご利用ください。所要時間は確定後に掲載します。" },
      { label:"バス",   text:"最寄りのバス停および臨時便の運行は調整中です。" },
      { label:"足元",   text:"会場内は一部未舗装です。歩きやすい靴でお越しください。" }
    ],
    car: [
      { label:"駐車場", text:"★台数および場所は決定次第掲載します。" },
      { label:"ご退場", text:"花火終了後は周辺道路の混雑が予想されます。お時間に余裕をもってお帰りください。" }
    ]
  },

  /* -------- フッター法務リンク（仕様書 30章） -------- */
  legal: [
    { label:"プライバシーポリシー", url:"#" },
    { label:"利用規約",           url:"#" },
    { label:"協賛規約",           url:"#" },
    { label:"チケット購入・返金規約", url:"#" },
    { label:"特定商取引法に基づく表記", url:"#" }
  ]
};
