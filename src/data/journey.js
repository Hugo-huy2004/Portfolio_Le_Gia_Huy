/**
 * /journey — báo tường những kỷ niệm, mới nhất lên đầu (bài mới nhất là bài trang nhất).
 *
 * Thêm một chặng = thêm một object:
 *   date    "YYYY" | "YYYY-MM" | "YYYY-MM-DD" (độ chi tiết hiển thị theo đúng độ dài này).
 *           Chỉ ghi ngày chủ nhân đã cung cấp, không đoán (tránh lộ thông tin cá nhân như năm sinh).
 *           Bỏ trống: chặng không hiện ngày và đứng ngay sau chặng phía trên nó trong danh sách này.
 *   until   (tuỳ chọn) ngày kết thúc cùng định dạng, cho chặng kéo dài nhiều năm: hiển thị "2024 – 2025"
 *   kind    "education" | "travel" | "community" | "milestone" | "culture"
 *   place   nơi chốn (tuỳ chọn), title, body: { vi, en }
 *   photos  tạo bằng scripts/journey-photo.sh <ảnh gốc> <tên> → public/journey-photos/<tên>.webp (+ -800, -bg). Ảnh 1 là ảnh dán chính, các ảnh sau là polaroid.
 *           Ảnh chính chụp dọc thì thêm `tall: true` để không bị cắt thành khung ngang.
 *           `focus` (tuỳ chọn, CSS object-position, vd "center 20%") chọn phần giữ lại khi ảnh bị cắt.
 *   logo    dùng khi chưa có ảnh.
 *   youtube ID video YouTube (phần sau "v=" hoặc "youtu.be/"), vd "dQw4w9WgXcQ". Có ảnh thì video nằm dưới ảnh;
 *           không có ảnh thì video chính là khung lớn của chặng.
 */
export const journey = [
  {
    id: "aws-bitexco",
    date: "2026",
    kind: "education",
    youtube: "qnwIYr70oU4",
    place: { vi: "AWS · Bitexco Financial Tower, TP. Hồ Chí Minh", en: "AWS · Bitexco Financial Tower, Ho Chi Minh City" },
    title: { vi: "Tham quan văn phòng AWS", en: "Visiting the AWS office" },
    body: {
      vi: "Cùng trường ghé thăm văn phòng Amazon Web Services tại Bitexco Financial Tower.",
      en: "A school visit to the Amazon Web Services office in Bitexco Financial Tower.",
    },
  },
  {
    id: "dalat-2026",
    date: "2026-02",
    kind: "travel",
    place: { vi: "Đà Lạt · Lâm Đồng", en: "Đà Lạt · Lâm Đồng" },
    title: { vi: "Đà Lạt, lần trở lại", en: "Đà Lạt, once more" },
    body: {
      vi: "Trở lại Đà Lạt cùng bạn bè: một đồi hoa tím, ba kiểu tạo dáng không ai giống ai, và những gốc thông quen thuộc.",
      en: "Back in Đà Lạt with friends: a hillside of purple flowers, three poses that matched nothing, and the familiar pines.",
    },
    photos: [
      { src: "/journey-photos/dalat-2026-garden.webp", focus: "center 70%", alt: { vi: "Ba người bạn co chân tạo dáng trước đồi hoa và bậc thang đá", en: "Three friends kicking up a leg in front of a flower hill and stone steps" } },
      { src: "/journey-photos/dalat-2026-pines.webp", alt: { vi: "Lê Gia Huy đeo kính râm đứng giữa hai gốc thông", en: "Lê Gia Huy in sunglasses standing between two pine trunks" } },
    ],
  },
  {
    id: "ao-dai-tet-2025",
    date: "2025",
    kind: "culture",
    place: { vi: "Nhà hát Thành phố · TP. Hồ Chí Minh", en: "Saigon Opera House · Ho Chi Minh City" },
    title: { vi: "Áo dài Tết Ất Tỵ", en: "Áo dài for Tết, Year of the Snake" },
    body: {
      vi: "Áo dài đỏ đô, quạt nan trong tay, đón Tết năm con rắn trước Nhà hát Thành phố.",
      en: "A deep red áo dài and a woven fan, welcoming the Year of the Snake in front of the Opera House.",
    },
    photos: [
      { src: "/journey-photos/ao-dai-opera.webp", focus: "center 40%", alt: { vi: "Lê Gia Huy mặc áo dài đỏ, khoanh tay trước Nhà hát Thành phố", en: "Lê Gia Huy in a red áo dài, arms crossed, in front of the Saigon Opera House" } },
      { src: "/journey-photos/ao-dai-fan.webp", focus: "center 30%", alt: { vi: "Lê Gia Huy cầm quạt nan, mỉm cười trên quảng trường", en: "Lê Gia Huy smiling with a woven fan on the square" } },
      { src: "/journey-photos/ao-dai-wave.webp", focus: "center 30%", alt: { vi: "Lê Gia Huy đeo kính râm, giơ tay chào", en: "Lê Gia Huy in sunglasses, waving a peace sign" } },
      { src: "/journey-photos/ao-dai-fountain.webp", focus: "center 30%", alt: { vi: "Lê Gia Huy mặc áo dài đỏ bên đài phun nước", en: "Lê Gia Huy in a red áo dài beside a fountain" } },
    ],
  },
  {
    id: "dalat-2024",
    date: "2024",
    kind: "travel",
    place: { vi: "Đà Lạt · Lâm Đồng", en: "Đà Lạt · Lâm Đồng" },
    title: { vi: "Đà Lạt mùa dã quỳ", en: "Đà Lạt in wild sunflower season" },
    body: {
      vi: "Dã quỳ vàng rực, đồi cỏ hồng dưới rừng thông, mấy chú alpaca háu ăn, chợ đêm đông người và một cây thông Noel đến sớm.",
      en: "Blazing wild sunflowers, pink grass under the pines, a few hungry alpacas, a crowded night market and an early Christmas tree.",
    },
    photos: [
      { src: "/journey-photos/dalat-wild-sunflowers.webp", focus: "center 35%", alt: { vi: "Lê Gia Huy dang tay trước bụi dã quỳ vàng", en: "Lê Gia Huy with arms wide in front of wild sunflowers" } },
      { src: "/journey-photos/dalat-pink-grass.webp", alt: { vi: "Lê Gia Huy ngồi trên đồi cỏ hồng", en: "Lê Gia Huy sitting on a hill of pink grass" } },
      { src: "/journey-photos/dalat-alpacas.webp", alt: { vi: "Lê Gia Huy cho hai chú alpaca ăn", en: "Lê Gia Huy feeding two alpacas" } },
      { src: "/journey-photos/dalat-garden-cabin.webp", focus: "70% center", alt: { vi: "Lê Gia Huy khoanh tay ngồi bên ngôi nhà gỗ trắng trong vườn", en: "Lê Gia Huy sitting arms crossed by a white wooden cabin in a garden" } },
      { src: "/journey-photos/dalat-christmas.webp", focus: "center 30%", alt: { vi: "Lê Gia Huy giơ tay chào bên cây thông Noel", en: "Lê Gia Huy waving beside a Christmas tree" } },
      { src: "/journey-photos/dalat-night-market.webp", focus: "center 30%", alt: { vi: "Lê Gia Huy cười tươi ở chợ đêm Đà Lạt", en: "Lê Gia Huy smiling at the Đà Lạt night market" } },
    ],
  },
  {
    id: "lotte-hanoi",
    date: "2022-08-04",
    kind: "travel",
    place: { vi: "Hà Nội", en: "Hanoi" },
    title: { vi: "Hà Nội, từ sân bay tới đỉnh Lotte", en: "Hanoi, from the runway to the top of Lotte" },
    body: {
      vi: "Thẻ lên máy bay trong tay, rồi đứng trên sàn kính Lotte với cả Hà Nội trải ra dưới chân, và một đôi cánh vẽ sẵn chờ người đến ghép vào.",
      en: "Boarding pass in hand, then the glass floor of Lotte with all of Hanoi spread out below, and a pair of painted wings waiting for someone to fill them.",
    },
    photos: [
      { src: "/journey-photos/lotte-hanoi-wings.webp", focus: "center 55%", alt: { vi: "Lê Gia Huy khoanh tay giữa đôi cánh vẽ trên vách kính, phía sau là toàn cảnh Hà Nội", en: "Lê Gia Huy, arms crossed, between wings painted on the glass with Hanoi below" } },
      { src: "/journey-photos/hanoi-flight.webp", focus: "center 70%", alt: { vi: "Lê Gia Huy giơ thẻ lên máy bay bên chiếc Airbus A320 trên sân đỗ", en: "Lê Gia Huy holding up a boarding pass beside an Airbus A320 on the apron" } },
      { src: "/journey-photos/lotte-hanoi-mirror.webp", alt: { vi: "Lê Gia Huy chụp ảnh qua gương, áo sơ mi trắng", en: "Lê Gia Huy taking a mirror selfie in a white shirt" } },
    ],
  },
  {
    id: "eighteen",
    kind: "milestone",
    title: { vi: "Mười tám tủi", en: "Eighteen" },
    body: {
      vi: "Hai quả bóng số 1 và 8, một chiếc ghế vàng, chân bắt chéo cho ra dáng người lớn.",
      en: "Two balloons, a 1 and an 8, a yellow armchair, and legs crossed to look properly grown up.",
    },
    photos: [
      { src: "/journey-photos/eighteen-balloons.webp", tall: true, focus: "center 30%", alt: { vi: "Lê Gia Huy ôm bóng số 18 trên ghế bành vàng trước tường hoa", en: "Lê Gia Huy hugging number 18 balloons on a yellow armchair in front of a flower wall" } },
      { src: "/journey-photos/eighteen-roses.webp", focus: "center 60%", alt: { vi: "Lê Gia Huy ngồi ghế gỗ trước bức tường hoa hồng đỏ", en: "Lê Gia Huy on a wooden chair in front of a wall of red roses" } },
    ],
  },
  {
    id: "korea",
    date: "2018",
    kind: "travel",
    place: { vi: "Seoul & đảo Nami · Hàn Quốc", en: "Seoul & Nami Island · South Korea" },
    title: { vi: "Hàn Quốc", en: "South Korea" },
    body: {
      vi: "Tháp Namsan sáng xanh giữa đêm Seoul, và một ngày đi giữa rừng thông trên đảo Nami.",
      en: "Namsan Tower glowing blue over Seoul at night, and a day among the pines on Nami Island.",
    },
    photos: [
      { src: "/journey-photos/seoul-namsan.webp", tall: true, focus: "center 55%", alt: { vi: "Lê Gia Huy dang tay trước tháp Namsan sáng đèn xanh ban đêm", en: "Lê Gia Huy with arms wide in front of Namsan Tower lit blue at night" } },
      { src: "/journey-photos/nami-island.webp", focus: "right center", alt: { vi: "Lê Gia Huy giơ gậy tự sướng trong khu vườn trên đảo Nami", en: "Lê Gia Huy holding up a selfie stick in a garden on Nami Island" } },
    ],
  },
  {
    id: "trang-an",
    date: "2020-07-08",
    kind: "travel",
    place: { vi: "Tràng An · Ninh Bình", en: "Tràng An · Ninh Bình" },
    title: { vi: "Chèo xuồng Tràng An", en: "Rowing through Tràng An" },
    body: {
      vi: "Đầm sen dưới chân núi đá, rồi tự tay cầm mái chèo xuôi theo dòng nước.",
      en: "A lotus pond at the foot of the karst hills, then taking an oar ourselves down the water.",
    },
    photos: [
      { src: "/journey-photos/trang-an-lotus.webp", focus: "center 60%", alt: { vi: "Lê Gia Huy đội nón lá đan, ngồi bên đầm sen dưới chân núi", en: "Lê Gia Huy in a woven straw hat by a lotus pond under the hills" } },
      { src: "/journey-photos/trang-an-boat.webp", focus: "left center", alt: { vi: "Cả nhóm mặc áo phao, cùng chèo xuồng số 1142", en: "The group in life jackets rowing boat 1142 together" } },
    ],
  },
  {
    id: "ha-long",
    date: "2020-07-07",
    kind: "travel",
    place: { vi: "Vịnh Hạ Long · Quảng Ninh", en: "Hạ Long Bay · Quảng Ninh" },
    title: { vi: "Vịnh Hạ Long", en: "Hạ Long Bay" },
    body: {
      vi: "Những vách đá vôi đứng giữa mặt nước xanh, nhìn từ lối đi trên đảo.",
      en: "Limestone cliffs standing out of green water, seen from a path on one of the islands.",
    },
    photos: [
      { src: "/journey-photos/ha-long-bay.webp", focus: "center 15%", alt: { vi: "Lê Gia Huy tựa lan can, nhìn ra vịnh Hạ Long và những vách đá vôi", en: "Lê Gia Huy leaning on a railing, looking out over Hạ Long Bay and its limestone cliffs" } },
    ],
  },
  {
    id: "fansipan",
    date: "2020-07-06",
    kind: "travel",
    place: { vi: "Fansipan, Sa Pa · Lào Cai", en: "Fansipan, Sa Pa · Lào Cai" },
    title: { vi: "Lên đỉnh Fansipan", en: "Summit of Fansipan" },
    body: {
      vi: "Nóc nhà Đông Dương, 3.143 m. Trên đỉnh chỉ có sương mù trắng xoá, và một kiểu tạo dáng không thể nghiêm túc hơn.",
      en: "The roof of Indochina, 3,143 m. Nothing but white fog at the top, and a pose that could not have been more serious.",
    },
    photos: [
      { src: "/journey-photos/fansipan-summit.webp", tall: true, alt: { vi: "Lê Gia Huy tạo dáng dab bên cột mốc Fansipan 3.143 m", en: "Lê Gia Huy dabbing beside the Fansipan 3,143 m summit marker" } },
      { src: "/journey-photos/fansipan-fog.webp", alt: { vi: "Hai người khoác khăn, đeo kính râm giữa sương mù trên đỉnh", en: "Two travellers in scarves and sunglasses in the fog at the top" } },
    ],
  },
  {
    id: "ndc-start",
    date: "2019",
    kind: "education",
    logo: "/education/nguyen-dinh-chieu.webp",
    place: { vi: "Mỹ Tho, Tiền Giang", en: "Mỹ Tho, Tiền Giang" },
    title: { vi: "Bước vào THPT Nguyễn Đình Chiểu", en: "Starting at Nguyễn Đình Chiểu High School" },
    body: {
      vi: "Ngôi trường mở cửa từ năm 1879 với tên Collège de Mytho.",
      en: "A school that opened in 1879 as the Collège de Mytho.",
    },
  },
  {
    id: "ndc-graduate",
    date: "2022",
    kind: "education",
    place: { vi: "Mỹ Tho, Tiền Giang", en: "Mỹ Tho, Tiền Giang" },
    title: { vi: "Tốt nghiệp THPT", en: "High school diploma" },
    body: {
      vi: "Khép lại niên khoá 2019 – 2022.",
      en: "Closing the 2019 – 2022 class years.",
    },
    photos: [
      { src: "/journey-photos/ndc-graduate-class.webp", alt: { vi: "Lớp tốt nghiệp tung mũ trước dãy nhà Collège de Mytho", en: "The graduating class throwing their caps in front of the Collège de Mytho building" } },
      { src: "/journey-photos/ndc-graduate-portrait.webp", alt: { vi: "Lê Gia Huy mặc lễ phục, cầm bằng tốt nghiệp THPT", en: "Lê Gia Huy in a graduation gown, holding the high school diploma" } },
      { src: "/journey-photos/ndc-graduate-12d2.webp", alt: { vi: "Lớp 12D2 cầm những tấm bảng ước mơ trong phòng học", en: "Class 12D2 holding up their wishes for the future in the classroom" } },
    ],
  },
  {
    id: "huynh-truong-promise",
    date: "2023-11-19",
    kind: "community",
    place: { vi: "Thiếu Nhi Thánh Thể · Mỹ Tho", en: "Eucharistic Youth · Mỹ Tho" },
    title: { vi: "Tuyên hứa Huynh trưởng Cấp 1", en: "Promised as a Level 1 Youth Leader" },
    body: {
      vi: "Lời tuyên hứa trở thành Huynh trưởng Cấp 1 của Thiếu Nhi Thánh Thể, nhận lấy việc dẫn dắt các em thiếu nhi.",
      en: "The promise to become a Level 1 leader of the Eucharistic Youth, taking on the work of leading the children.",
    },
    photos: [
      { src: "/journey-photos/huynh-truong-promise.webp", alt: { vi: "Các Huynh trưởng mới cùng các linh mục sau lễ tuyên hứa trong nhà thờ", en: "The new leaders with the priests after the promise ceremony in the church" } },
      { src: "/journey-photos/huynh-truong-team.webp", alt: { vi: "Nhóm Huynh trưởng trong đồng phục trước tượng Chúa Giêsu Lòng Thương Xót", en: "The leaders in uniform in front of the Divine Mercy statue" } },
      { src: "/journey-photos/huynh-truong-certificates.webp", alt: { vi: "Các Huynh trưởng giơ cao Chứng chỉ khả năng Huynh trưởng Cấp 1", en: "The leaders holding up their Level 1 Youth Leader certificates" } },
    ],
  },
  {
    id: "tabor-03",
    date: "2024",
    until: "2025",
    kind: "community",
    place: { vi: "Thiếu Nhi Thánh Thể · Giáo phận Mỹ Tho", en: "Eucharistic Youth · Diocese of Mỹ Tho" },
    title: { vi: "Sa mạc Huynh trưởng Cấp 2 · Tabor 03", en: "Level 2 Leader Training Camp · Tabor 03" },
    body: {
      vi: "Sa mạc huấn luyện Huynh trưởng Cấp 2 với chủ đề Hiệp Thông – Tham Gia – Sứ Vụ. Những ngày cắm trại, sinh hoạt đội và học cách dẫn dắt cùng anh em.",
      en: "Level 2 youth leader training camp, themed Communion – Participation – Mission. Days of camping, team life and learning to lead alongside the others.",
    },
    photos: [
      { src: "/journey-photos/tabor-03-team.webp", alt: { vi: "Đội 10 Irênê tại sa mạc Tabor 03, cầm cờ đội và bảng tên", en: "Team 10 Irênê at the Tabor 03 camp with their flag and team sign" } },
      { src: "/journey-photos/tabor-03-friends.webp", alt: { vi: "Bốn trại sinh quàng khăn, cười trong giờ sinh hoạt", en: "Four campers in scarves, smiling between activities" } },
      { src: "/journey-photos/tabor-03-lawn.webp", alt: { vi: "Anh em trong đội ngồi trên bãi cỏ dưới gốc cây", en: "The team sitting on the lawn under a tree" } },
    ],
  },
  {
    id: "huynh-truong-2-promise",
    date: "2025-11-16",
    kind: "community",
    place: { vi: "Liên Đoàn Các Thánh Tử Đạo Việt Nam · Gp. Mỹ Tho", en: "Vietnamese Martyrs Federation · Diocese of Mỹ Tho" },
    title: { vi: "Tuyên hứa Huynh trưởng Cấp 2", en: "Promised as a Level 2 Youth Leader" },
    body: {
      vi: "Sau hai mùa sa mạc huấn luyện, lời tuyên hứa Huynh trưởng Cấp 2 trong Thánh lễ của Liên Đoàn.",
      en: "After two seasons of training camps, the Level 2 leader promise at the Federation's Mass.",
    },
    photos: [
      { src: "/journey-photos/huynh-truong-2-team.webp", alt: { vi: "Các Huynh trưởng cùng khoá trước tượng Chúa Giêsu Lòng Thương Xót sau lễ tuyên hứa", en: "Fellow leaders in front of the Divine Mercy statue after the promise" } },
      { src: "/journey-photos/huynh-truong-2-promise.webp", alt: { vi: "Lê Gia Huy giơ tay tuyên hứa khi linh mục cài huy hiệu", en: "Lê Gia Huy raising a hand to make the promise as the priest pins the badge" } },
    ],
  },
  {
    id: "greenwich-award",
    date: "2026-09-17",
    kind: "education",
    place: { vi: "University of Greenwich (Việt Nam)", en: "University of Greenwich (Vietnam)" },
    title: { vi: "Sinh viên xuất sắc nhất môn Mobile App", en: "Best Student in Mobile App Development" },
    body: {
      vi: "Certificate of Merit tại Student Honoring Ceremony kỳ Summer 2026, cho môn Thiết kế & Phát triển Ứng dụng Di động, với dự án MHike.",
      en: "A Certificate of Merit at the Summer 2026 Student Honoring Ceremony, for Mobile Application Design & Development, with the MHike project.",
    },
    photos: [
      { src: "/journey-photos/greenwich-award-stage.webp", alt: { vi: "Lê Gia Huy nhận giấy chứng nhận trên sân khấu lễ tôn vinh", en: "Lê Gia Huy receiving the certificate on the ceremony stage" } },
      { src: "/journey-photos/greenwich-award-portrait.webp", alt: { vi: "Lê Gia Huy cầm Certificate of Merit", en: "Lê Gia Huy holding the Certificate of Merit" } },
    ],
  },
];
