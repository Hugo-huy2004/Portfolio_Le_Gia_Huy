/**
 * Nguồn DUY NHẤT của mục "Dự án": khối nổi bật ở /introduction, trang
 * /project và từng trang /project/:slug đều đọc từ đây. Thêm dự án = thêm một
 * phần tử, không sửa trang nào cả.
 *
 * Ảnh nằm ở `public/project-screenshots/<id>/*.webp` — chụp thật từ site đang
 * chạy, đã nén WebP 1600px. Chụp lại thì ghi đè đúng tên tệp, đừng đổi tên.
 *
 * `repo` là địa chỉ mã nguồn mở, hiện thành liên kết thứ hai ở trang chi tiết.
 *
 * `device: "phone"` khi ảnh là màn hình điện thoại dọc: trang chi tiết đổi khung trình duyệt thành khung điện thoại.
 * `report` (tuỳ chọn) là báo cáo học thuật hiển thị cuối trang chi tiết: tóm tắt, các mục (đoạn văn,
 * danh sách, bảng, hình, tiểu mục) và tài liệu tham khảo. Bảng và hình được đánh số tự động.
 *
 * `cover` chọn tấm ảnh làm bìa trên trang /project; bỏ trống thì lấy tấm đầu
 * trong `shots`.
 *
 * `startedAt` ("YYYY-MM") là MỐC XẾP DÒNG THỜI GIAN của trang /project —
 * triển lãm chạy từ dự án đầu tiên tới nay, nên dự án mới chỉ cần ghi đúng mốc
 * này là tự vào đúng chỗ. Nó không hiển thị; chữ hiển thị vẫn là `period`.
 *
 * `kind` là MÃ ("personal" | "client" | "live" | "coursework") chứ không phải chữ hiển thị —
 * nhãn nằm ở `projectsPage.kinds.*` trong i18n. `period` giữ nguyên con số;
 * `{now}` được thay bằng chữ "nay" theo ngôn ngữ đang chọn. Tagline và vai trò
 * cũng nằm trong i18n (`projectsPage.items.<id>`), ở đây chỉ còn bản tiếng Việt
 * làm nguồn đối chiếu.
 */

export const projects = [
  {
    id: "mhike",
    title: "M-Hike",
    tagline: "Ứng dụng quản lý chuyến đi bộ đường dài, hiện thực hai lần: Android native (Java) và đa nền tảng (React Native).",
    kind: "coursework",
    device: "phone",
    startedAt: "2026-07",
    period: "07–08/2026",
    role: "Thiết kế & lập trình toàn phần",
    url: "https://hiking.hugowishpax.studio",
    urlLabel: "hiking.hugowishpax.studio",
    repo: "https://github.com/Hugo-huy2004/Hiking_App",
    cover: "award-stage",
    stack: ["Java", "Android SDK", "SQLite", "Firebase", "React Native", "Expo", "TypeScript", "OpenStreetMap"],
    techNote:
      "Hai hiện thực trên cùng một nhánh dữ liệu Firebase. Bản Android native viết bằng Java theo mô hình Activity–Adapter–Model. Bản đa nền tảng viết bằng React Native (Expo) và TypeScript, tổ chức local-first với SQLite.",
    summary:
      "Đồ án học phần COMP1786 – Thiết kế và Phát triển Ứng dụng Di động, University of Greenwich (Việt Nam). Đạt 77% và giải Sinh viên xuất sắc nhất học phần kỳ Summer 2026.",
    highlights: [
      {
        title: "Local-first cho môi trường mất kết nối",
        body:
          "Bản React Native ghi mọi thao tác vào SQLite trước, sau đó đồng bộ lên Firebase theo kiểu best-effort. Ứng dụng vẫn hoạt động khi kết nối gián đoạn, đúng với bối cảnh đi bộ đường dài.",
      },
      {
        title: "Quan hệ chuyến đi – quan sát được bảo toàn",
        body:
          "Schema SQLite tách hai bảng hikes và observations, bật khoá ngoại với ON DELETE CASCADE. Một chuyến đi có nhiều quan sát; xoá chuyến đi thì các quan sát liên quan bị xoá theo.",
      },
      {
        title: "Tìm kiếm đa tiêu chí bằng truy vấn tham số hoá",
        body:
          "Tìm kiếm cơ bản theo tiền tố tên; tìm kiếm nâng cao dựng mệnh đề WHERE động theo tên, địa điểm, khoảng độ dài, khoảng ngày và độ khó, không ghép trực tiếp dữ liệu người dùng vào SQL.",
      },
      {
        title: "Chức năng mở rộng ngoài đặc tả",
        body:
          "Theo dõi hành trình bằng GPS, thời tiết, tín hiệu SOS, kế hoạch luyện tập 12 tuần, giao diện song ngữ Anh – Việt và chế độ tối.",
      },
    ],
    closing: "Hiện thực một ứng dụng bằng hai cách cho thấy rõ: giao diện hoàn chỉnh chưa đồng nghĩa với đáp ứng đặc tả.",
    shots: [
      { src: "h01", caption: "Trang chủ bản native: thời tiết, thao tác nhanh, tổng quãng đường." },
      { src: "h27", caption: "Trang chủ bản React Native trên iPhone 16 Pro." },
      { src: "h46", caption: "Tìm kiếm nâng cao theo độ khó, quãng đường, ngày và địa điểm." },
      { src: "h51", caption: "Theo dõi hành trình: thời gian, tốc độ, quãng đường, trạng thái GPS." },
      { src: "h57", caption: "Emergency SOS Beacon." },
      { src: "award-stage", caption: "Nhận giải Sinh viên xuất sắc nhất học phần, 17.09.2026." },
    ],
    report: {
      title: "Báo cáo dự án",
      abstract:
        "Báo cáo đánh giá hai hiện thực của M-Hike: MHike Android App viết native bằng Java và MHike App đa nền tảng viết bằng React Native/Expo và TypeScript. Việc đánh giá dựa trên đặc tả học phần, đọc mã nguồn, build thực nghiệm, chạy ứng dụng trên Pixel 7 và iPhone 16 Pro, và thực thi bộ kiểm thử logic. Kết quả cho thấy bản React Native có lớp SQLite và tìm kiếm nâng cao đầy đủ hơn, trong khi bản native có giao diện tương đối hoàn thiện nhưng còn lệch đặc tả ở vai trò của SQLite, tìm kiếm nâng cao và liên kết quan sát khi chỉnh sửa.",
      sections: [
        {
          title: "Phạm vi và phương pháp",
          list: [
            "Đối chiếu từng yêu cầu (a)–(g) của đề bài với luồng giao diện và mã nguồn thực tế.",
            "Build bản native bằng Gradle, cài APK debug và chạy trên thiết bị giả lập Pixel 7.",
            "Chạy bản React Native trên Pixel 7 và iPhone 16 Pro; thực hiện typecheck, lint, kiểm thử logic và build Expo web để đối chiếu giao diện responsive.",
            "Đánh giá HCI, bảo mật, khả năng thích ứng màn hình và điều kiện triển khai theo tài liệu chính thức và OWASP MASVS.",
          ],
        },
        {
          title: "Kiến trúc",
          paragraphs: [
            "Bản Android native tổ chức theo Activity–Adapter–Model, dùng Firebase Realtime Database làm nguồn dữ liệu chính và SQLite làm bộ nhớ đệm danh sách chuyến đi. Cách tổ chức này cho giao diện phản hồi nhanh nhưng chưa đáp ứng trọn vẹn yêu cầu SQLite là cơ chế lưu trữ của các chức năng (b) và (c).",
            "Bản React Native tổ chức local-first: db.ts quản lý SQLite (chế độ WAL, khoá ngoại), api.ts bọc thao tác cục bộ và đồng bộ lên Firebase theo kiểu best-effort. Đây là hướng phù hợp hơn với ngữ cảnh đi bộ đường dài, nơi kết nối mạng có thể gián đoạn.",
          ],
        },
        {
          title: "Đối chiếu đặc tả",
          table: {
            caption: "Đối chiếu đặc tả với hai hiện thực M-Hike.",
            head: ["Yêu cầu", "Native (Java)", "React Native", "Căn cứ"],
            rows: [
              ["(a) Nhập chuyến đi", "Một phần", "Hoàn thành", "Trường bắt buộc, trường tự thiết kế, GPS, ngày và bước xác nhận; bản native chưa hiện lỗi cho một số trường văn bản."],
              ["(b) Lưu, xem, sửa, xoá, reset", "Một phần", "Hoàn thành", "Native CRUD qua Firebase, SQLite chỉ làm bộ nhớ đệm; React Native dùng SQLite cho CRUD và xoá toàn bộ."],
              ["(c) Quan sát", "Một phần", "Hoàn thành", "React Native có khoá ngoại, nhiều quan sát cho một chuyến và xoá dây chuyền."],
              ["(d) Tìm kiếm", "Một phần", "Hoàn thành", "React Native lọc theo tên, địa điểm, khoảng độ dài, khoảng ngày và độ khó."],
              ["(e) Nguyên mẫu đa nền tảng", "—", "Hoàn thành", "Chạy trên Android và iOS; biểu mẫu tái hiện yêu cầu (a) có xác thực và màn hình xác nhận."],
              ["(f) Lưu trữ đa nền tảng", "—", "Hoàn thành", "Schema, migration, CRUD, tìm kiếm và quan hệ quan sát – chuyến đi trên SQLite."],
              ["(g) Chức năng bổ sung", "Một phần", "Một phần", "GPS, thời tiết, SOS, ảnh, kế hoạch luyện tập, song ngữ, giao diện tối; một số tích hợp cần khoá cấu hình thật."],
            ],
          },
        },
        {
          title: "Kiểm chứng kỹ thuật",
          table: {
            caption: "Kết quả xác minh kỹ thuật.",
            head: ["Thành phần", "Phép kiểm", "Kết quả"],
            rows: [
              ["Android native", "./gradlew clean assembleDebug", "Đạt — APK cài và chạy trên Pixel 7"],
              ["React Native", "npm run typecheck", "Đạt — không có lỗi kiểu"],
              ["React Native", "npm run lint", "Đạt, 3 cảnh báo import chưa dùng"],
              ["React Native", "health.check.ts", "Đạt — 7 nhóm kiểm tra logic"],
              ["Expo web", "npm run build", "Đạt"],
              ["React Native – Android", "Chạy trên Pixel 7", "Đạt"],
              ["React Native – iOS", "Chạy trên iPhone 16 Pro", "Đạt"],
              ["Phụ thuộc npm", "npm audit", "Cần xử lý — lỗ hổng gián tiếp"],
            ],
          },
        },
        {
          title: "Minh chứng giao diện — Android native",
          figures: [
            { src: "h01", caption: "Trang chủ: thời tiết, thao tác nhanh, tổng quãng đường và điều hướng đáy." },
            { src: "h02", caption: "Danh sách chuyến đi: tìm kiếm, bộ lọc trạng thái và thẻ dữ liệu." },
            { src: "h03", caption: "Tìm kiếm cơ bản theo tên và địa điểm." },
            { src: "h05", caption: "Biểu mẫu chuyến đi: trường bắt buộc, trường bổ sung, GPS, ngày giờ." },
            { src: "h08", caption: "Thông báo xác thực khi chưa chọn thông tin đỗ xe." },
            { src: "h10", caption: "Màn hình xác nhận tổng hợp dữ liệu trước khi lưu." },
            { src: "h11", caption: "Chi tiết chuyến đi: trạng thái, độ khó, quãng đường, sửa, xoá, thêm ghi chú." },
            { src: "h12", caption: "Thống kê số chuyến, quãng đường và biểu đồ sáu tháng." },
            { src: "h17", caption: "Hộp thoại chọn chuyến đi trước khi tạo quan sát." },
            { src: "h18", caption: "Quan sát: tiêu đề, thời gian, điều kiện đường, động vật, thực vật." },
            { src: "h21", caption: "Biểu mẫu sửa được điền sẵn từ bản ghi đã chọn." },
            { src: "h22", caption: "Hộp thoại xác nhận xoá ngăn thao tác ngoài ý muốn." },
          ],
        },
        {
          title: "Minh chứng giao diện — React Native trên Android và iOS",
          figures: [
            { src: "h33", caption: "Onboarding trên Android giới thiệu lợi ích cốt lõi." },
            { src: "h34", caption: "Đăng nhập trên Android với Google." },
            { src: "h27", caption: "Trang chủ iOS ở chế độ tiếng Anh." },
            { src: "h28", caption: "Cùng trang chủ iOS sau khi chuyển sang tiếng Việt." },
            { src: "h29", caption: "Cài đặt iOS: ngôn ngữ, đơn vị, giao diện, ngoại tuyến." },
            { src: "h30", caption: "Cài đặt iOS ở tiếng Việt." },
            { src: "h31", caption: "Hộp thoại quyền vị trí của iOS." },
            { src: "h55", caption: "Cài đặt Android: giao diện, ngôn ngữ, cơ sở dữ liệu, đồng bộ." },
            { src: "h56", caption: "Cài đặt Android ở tiếng Việt; dữ liệu không đổi." },
          ],
        },
        {
          title: "Minh chứng chức năng — React Native (Expo web, viewport điện thoại)",
          note: "Bản export web của cùng mã React Native, dùng để kiểm tra chức năng và trạng thái giao diện; không thay cho ảnh chạy trên thiết bị.",
          figures: [
            { src: "h38", caption: "Lỗi xác thực hiển thị cạnh từng trường bắt buộc." },
            { src: "h40", caption: "Màn hình xác nhận trước khi lưu." },
            { src: "h41", caption: "Chi tiết chuyến đi: thời tiết, năng lượng ước tính, liên hệ khẩn cấp." },
            { src: "h44", caption: "Chi tiết quan sát có sửa và xoá." },
            { src: "h46", caption: "Tìm kiếm nâng cao kết hợp độ khó, quãng đường, ngày, địa điểm." },
            { src: "h47", caption: "Thống kê tổng chuyến, quãng đường và biểu đồ theo thời gian." },
            { src: "h51", caption: "Theo dõi hành trình: thời gian, tốc độ, quãng đường, GPS." },
            { src: "h57", caption: "Emergency SOS Beacon: trạng thái tín hiệu và hành động khẩn cấp." },
            { src: "h58", caption: "Kế hoạch luyện tập theo tuần." },
            { src: "h48", caption: "Cài đặt tiếng Việt ở giao diện tối." },
            { src: "h60", caption: "Hộp thoại xoá toàn bộ dữ liệu nêu hậu quả và có nút huỷ." },
          ],
        },
        {
          title: "Đánh giá",
          subsections: [
            {
              title: "Tương tác người – máy (HCI)",
              body: "Tiêu đề lớn, thẻ trên nền trung tính, điều hướng đáy năm mục, trạng thái rỗng và lựa chọn dạng nút giúp giảm tải ghi nhớ. Biểu mẫu chia nhóm, tự điền ngày, hỗ trợ GPS và có bước xác nhận trước khi lưu. Hạn chế ở bản native: một số trường bắt buộc bị chặn im lặng, biểu mẫu dài khi khoá chiều dọc, chưa kiểm thử TalkBack, cỡ chữ lớn và độ tương phản. Hướng cải tiến: gắn lỗi cạnh từng trường, đưa focus đến lỗi đầu tiên, đảm bảo mục tiêu chạm tối thiểu 48 dp và tương phản 4,5:1 (Android Developers, 2026a).",
            },
            {
              title: "Bảo mật và quyền riêng tư",
              body: "Ưu điểm: đăng nhập Google, Activity nội bộ đặt exported=false, Firebase có bộ nhớ đệm ngoại tuyến. Hạn chế: chưa có Firebase Security Rules trong kho mã, lớp REST chưa gắn ID token, hàm encryptData chỉ là mã hoá Base64 có thể đảo ngược, allowBackup đang bật. Ưu tiên khắc phục: Rules theo auth.uid, App Check, lưu token bằng Keystore/SecureStore, tối thiểu hoá quyền và quét phụ thuộc trong CI (Firebase, 2026; OWASP Foundation, 2026).",
            },
            {
              title: "Kích thước và trạng thái màn hình",
              body: "Cả hai bản dùng dp/sp, ScrollView hoặc Flexbox nên hoạt động tốt ở điện thoại dọc. Chưa có bố cục cho tablet, màn hình gập hay chia đôi cửa sổ. Hướng cải tiến: dùng window-size class và useWindowDimensions để chuyển sang bố cục danh sách – chi tiết, kiểm thử ở cỡ chữ 200% (Android Developers, 2026b; React Native, 2026).",
            },
            {
              title: "Triển khai thực tế",
              body: "Cần development/release build thay cho Expo Go, thống nhất applicationId, thay khoá Maps tạm, tách môi trường Firebase dev/staging/prod và thiết lập pipeline CI chạy Gradle, typecheck, lint, kiểm thử migration và ký Android App Bundle. Do ứng dụng xử lý vị trí, ảnh và liên hệ khẩn cấp, cần khai báo Data safety và chính sách quyền riêng tư trước khi phát hành (Expo, 2026; Google Play, 2026).",
            },
          ],
        },
        {
          title: "Phản tư",
          paragraphs: [
            "Giai đoạn đầu ưu tiên trang chủ, danh sách, biểu mẫu và điều hướng, giúp sớm có trải nghiệm nhất quán, nhưng khiến các yêu cầu nền tảng — SQLite, quan hệ chuyến đi – quan sát và tìm kiếm nâng cao — chưa được truy vết chặt từ đầu. Phần hiệu quả nhất là nguyên mẫu React Native theo hướng local-first, nơi schema, typecheck và bộ kiểm thử logic phát hiện lỗi mà không phụ thuộc thao tác thủ công.",
            "Nếu thực hiện lại, ma trận yêu cầu – màn hình – lớp dữ liệu – ca kiểm thử sẽ được lập trước khi viết giao diện, mỗi yêu cầu có tiêu chí chấp nhận cụ thể, và bảo mật được đưa vào kiến trúc từ đầu thay vì xử lý ở cuối dự án.",
          ],
        },
        {
          title: "Kết luận",
          paragraphs: [
            "M-Hike đạt nền tảng chức năng đáng kể: CRUD chuyến đi, biểu mẫu nhiều trường, quan sát, đăng nhập, GPS và nhiều tính năng mở rộng; bản React Native bổ sung SQLite local-first và tìm kiếm đa tiêu chí. Lộ trình tiếp theo là đưa CRUD native về SQLite, hoàn thiện tìm kiếm nâng cao native, cấu hình release build, rồi khoá chặt Firebase Rules, token và quyền trước khi tối ưu cho tablet.",
          ],
        },
      ],
      references: [
        "Android Developers (2026a) Make apps more accessible. Available at: https://developer.android.com/guide/topics/ui/accessibility/apps",
        "Android Developers (2026b) Responsive and adaptive layouts with Views. Available at: https://developer.android.com/develop/ui/views/layout/responsive-adaptive-design-with-views",
        "Expo (2026) Introduction to development builds. Available at: https://docs.expo.dev/develop/development-builds/introduction/",
        "Firebase (2026) Realtime Database Security Rules. Available at: https://firebase.google.com/docs/database/security",
        "Google Play (2026) Provide information for Google Play's Data safety section. Available at: https://support.google.com/googleplay/android-developer/answer/10787469",
        "OWASP Foundation (2026) Mobile Application Security Verification Standard (MASVS). Available at: https://mas.owasp.org/MASVS/",
        "React Native (2026) useWindowDimensions. Available at: https://reactnative.dev/docs/usewindowdimensions",
        "SQLite Consortium (2026) SQLite Foreign Key Support. Available at: https://www.sqlite.org/foreignkeys.html",
        "University of Greenwich (2025) COMP1786 Mobile Application Design and Development: Practical Coursework 1 2025/26. Unpublished module specification.",
      ],
    },
  },
  {
    id: "chanh-toa",
    title: "Xứ Đoàn Chánh Tòa Mỹ Tho",
    tagline: "Cổng thông tin giáo xứ: tra giờ lễ 27 giáo phận, Kinh Thánh trọn bộ, vấn đáp đức tin.",
    kind: "live",
    startedAt: "2026-08",
    period: "08/2026 – {now}",
    role: "Thiết kế & lập trình toàn phần",
    url: "https://chanhtoa.tnttgiaophanmytho.online",
    urlLabel: "chanhtoa.tnttgiaophanmytho.online",
    repo: "https://github.com/HuynhDutruong/FAQ",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "Firebase", "Firestore", "Graph API Facebook", "Sharp"],
    techNote:
      "Next.js với React và TypeScript, giao diện dựng bằng Tailwind, phần máy chủ chạy trên Node.js, dữ liệu nằm ở Firebase và Firestore, ảnh xử lý bằng Sharp. Bài viết lấy từ fanpage giáo xứ qua Graph API của Facebook. Chọn kết xuất phía máy chủ vì phần lớn nội dung là thứ Google cần đọc được: giờ lễ, từng chương Kinh Thánh, từng câu hỏi đức tin.",
    summary:
      "Giờ lễ là thứ thay đổi liên tục mà không ai báo. Đi xa một chút, muốn dự lễ, người ta phải hỏi quanh. Trang này ra đời để câu hỏi ấy có một chỗ trả lời.",
    highlights: [
      {
        title: "Câu hỏi thường gặp nhất",
        body:
          "Bật định vị là thấy nhà thờ gần nhất và lễ kế tiếp còn bao lâu, với dữ liệu phủ 27 giáo phận. Vì giờ lễ đổi luôn, chính giáo dân sửa được ngay tại thẻ đó — thông tin sống được là nhờ người dùng, không nhờ một lần nhập liệu.",
      },
      {
        title: "Rồi tới những câu ngại hỏi",
        body:
          "Sau giờ lễ là những thắc mắc người ta ngại hỏi trực tiếp: bí tích, luân lý, hôn nhân. Mỗi câu có một lời đáp ngắn để đọc lướt, và một bản dài kèm nguồn giáo lý cho người muốn đi tới cùng.",
      },
      {
        title: "Trọn bộ Lời Chúa, chia theo chương",
        body:
          "Cựu Ước và Tân Ước đầy đủ, mỗi sách một tranh minh hoạ, mỗi chương một địa chỉ riêng để gửi thẳng cho người khác. Phần kinh nguyện đếm lượt đọc và giữ chuỗi ngày — thứ giữ thói quen bền hơn mọi lời nhắc.",
      },
      {
        title: "Nối thẳng với fanpage của giáo xứ",
        body:
          "Giáo xứ vốn đăng tin trên trang Facebook của mình, và không ai muốn đăng lại lần thứ hai. Máy chủ gọi Graph API của Facebook theo lịch, lấy bài mới cùng ảnh, nén lại bằng Sharp rồi lưu vào Firestore — đăng trên fanpage một lần là tin xuất hiện ở cả hai nơi. Khoá truy cập nằm lại trên máy chủ, chặn thêm bằng Firestore rules, và không bao giờ đi xuống trình duyệt; mọi yêu cầu ghi đều phải kèm định danh quản trị viên.",
      },
    ],
    closing:
      "Trang đang chạy thật, giáo dân mở mỗi ngày. Với một cổng thông tin giáo xứ, thành công không phải lượt truy cập, mà là không còn ai phải gọi điện hỏi mấy giờ có lễ.",
    shots: [
      { src: "home", caption: "Trang chủ — Lời Chúa hôm nay, lịch phụng vụ, bài viết của xứ đoàn." },
      { src: "gio-le", caption: "Tra cứu giờ lễ toàn quốc, đếm ngược tới lễ kế tiếp." },
      { src: "kinh-thanh", caption: "Kinh Thánh trọn bộ 73 cuốn, mỗi sách một bức tranh." },
      { src: "van-dap", caption: "Vấn đáp giáo lý — 32 câu chia theo 7 chủ đề." },
      { src: "kinh-nguyen", caption: "Kinh nguyện cốt lõi, có đếm lượt và chuỗi ngày." },
      { src: "gioi-thieu", caption: "Giới thiệu — lịch sử giáo xứ kể thành bốn chương." },
    ],
  },
  {
    id: "hwj",
    title: "HWJ — Atelier Heritage",
    tagline: "Hệ thống thương mại điện tử trang sức cao cấp trên MERN: định giá theo giá kim loại, thanh toán PayPal xác minh phía máy chủ, bảng quản trị hợp nhất.",
    kind: "coursework",
    startedAt: "2026-01",
    period: "01–04/2026",
    role: "Thiết kế & lập trình toàn phần",
    url: "https://hwj-demo.hugowishpax.studio",
    urlLabel: "hwj-demo.hugowishpax.studio",
    repo: "https://github.com/Hugo-huy2004/HWJ_demo",
    stack: ["React", "TypeScript", "Vite", "Zustand", "Tailwind", "Material UI", "Node.js", "Express", "MongoDB", "Cloudinary", "Google OAuth", "PayPal", "JWT"],
    techNote:
      "Kiến trúc MERN tách bốn lớp: giao diện React 19 + TypeScript (Vite, Zustand, Tailwind, Material UI); máy chủ Node.js/Express theo REST; cơ sở dữ liệu MongoDB Atlas qua Mongoose; và lớp dịch vụ bên thứ ba gồm Google OAuth 2.0, PayPal SDK và Cloudinary.",
    summary:
      "Đồ án học phần COMP1842 – Web Programming 2, University of Greenwich (Việt Nam): số hoá toàn bộ quy trình kinh doanh trang sức, từ giới thiệu sản phẩm tới giao dịch tài chính và quản lý sau bán hàng.",
    highlights: [
      {
        title: "Thanh toán được xác minh phía máy chủ",
        body:
          "Sau khi PayPal báo thành công, backend gọi API PayPal để đối soát trạng thái và số tiền. Đơn hàng có tổng khác với con số PayPal ghi nhận bị từ chối, nên kết quả thanh toán không thể giả mạo từ trình duyệt.",
      },
      {
        title: "Bảo mật nhiều lớp",
        body:
          "Khách đăng nhập bằng Google OAuth 2.0; phiên được giữ bằng JWT. Mật khẩu quản trị băm bằng bcrypt; API quản trị có middleware kiểm tra vai trò, khoá API, CORS và giới hạn tần suất truy cập.",
      },
      {
        title: "Mô hình dữ liệu linh hoạt cho trang sức",
        body:
          "MongoDB lưu thuộc tính biến thiên của từng món (tuổi vàng, khối lượng kim loại, đá, SKU) dưới dạng tài liệu. Mongoose ràng buộc trường bắt buộc, mã voucher và mã sản phẩm duy nhất; hook tự cập nhật tổng chi tiêu và điểm thành viên sau mỗi đơn.",
      },
      {
        title: "Một bảng quản trị cho toàn bộ vận hành",
        body:
          "Khi quản trị viên đăng nhập, trang tài khoản chuyển thành bảng điều khiển: sản phẩm (ảnh lưu trên Cloudinary), đơn hàng, lịch hẹn tư vấn, yêu cầu hỗ trợ, khách hàng và cấu hình hệ thống như voucher, phí vận chuyển.",
      },
    ],
    closing:
      "Bài học lớn nhất: phần lớn thành công của một dự án full-stack nằm ở cấu trúc dữ liệu thiết kế đúng từ đầu, và lớp phòng thủ quan trọng nhất luôn phải ở backend.",
    shots: [
      { src: "home", caption: "Trang chủ — \"The Art of Preservation\"." },
      { src: "collections", caption: "Bộ sưu tập, bày theo nhịp một bài tạp chí." },
      { src: "valuation", caption: "Bảng định giá vàng – bạc, cập nhật theo thị trường." },
      { src: "product", caption: "Trang một món — thông số, chất liệu và giá suy từ giá kim loại." },
      { src: "heritage", caption: "Dòng thời gian nhà xưởng, kể theo chương." },
      { src: "appointment", caption: "Đặt lịch tư vấn sở hữu, thay cho nút mua ngay." },
    ],
    report: {
      title: "Báo cáo dự án",
      abstract:
        "HWJ (Hugo Wishpax Jewellery) là hệ thống thương mại điện tử trang sức cao cấp được phát triển trên kiến trúc full-stack MERN. Mục tiêu của dự án là số hoá quy trình kinh doanh trang sức, từ giới thiệu sản phẩm tới giao dịch tài chính và quản lý sau bán hàng. Điểm khác biệt cốt lõi nằm ở việc tích hợp chuỗi dịch vụ thực tế: cập nhật giá kim loại quý theo thị trường, xác thực người dùng qua bên thứ ba, thanh toán được đối soát phía máy chủ và hoá đơn điện tử minh bạch. Hệ thống triển khai đầy đủ các thao tác CRUD với phân quyền rõ ràng giữa khách hàng và quản trị viên.",
      sections: [
        {
          title: "Quy trình phát triển",
          paragraphs: [
            "Dự án theo mô hình phát triển lặp và tăng dần, cho phép kiểm soát chất lượng sau từng vòng và tích hợp tính năng mới một cách linh hoạt. Quy trình gồm sáu giai đoạn:",
          ],
          list: [
            "Khảo sát yêu cầu nghiệp vụ: xác định vai trò khách hàng và quản trị viên, luồng đặt hàng, chính sách bảo hành và đổi trả đặc thù ngành trang sức.",
            "Thiết kế kiến trúc tổng thể: tách giao diện (React), máy chủ (Express/Node.js), cơ sở dữ liệu (MongoDB) và lớp tích hợp dịch vụ bên thứ ba (PayPal, Cloudinary).",
            "Thiết kế giao diện và điều hướng: chuẩn hoá sơ đồ trang cho cả khách hàng và quản trị viên.",
            "Thiết kế mô hình dữ liệu: chuẩn hoá thực thể, ràng buộc dữ liệu và tối ưu chỉ mục truy vấn.",
            "Triển khai bảo mật và thanh toán: xác thực JWT, bảo vệ API quản trị, giới hạn tần suất và xác minh giao dịch PayPal phía máy chủ.",
            "Kiểm thử tích hợp: kiểm thử thủ công đầu–cuối toàn bộ luồng nghiệp vụ.",
          ],
        },
        {
          title: "Thiết kế giao diện và điều hướng",
          paragraphs: [
            "Giao diện theo phong cách Luxury Minimalism với bảng màu nhận diện #ec003f và #020618. Các trang được nhóm theo nhiệm vụ để tối ưu hành trình khách hàng: nhóm Khám phá (Heritage, Collections, Product Detail), nhóm Giao dịch (Cart, Confirm Order, Valuation), nhóm Dịch vụ (Appointment, Policies, Support) và nhóm Tài khoản (hồ sơ thành viên và bảng quản trị).",
            "Điều hướng phía khách do React Router quản lý; phía máy chủ chia thành các mô-đun REST độc lập sau cổng /api: /auth và /admins cho định danh, /products, /orders và /vouchers cho nghiệp vụ lõi, /appointments và /support/tickets cho chăm sóc khách hàng, /settings cho cấu hình hệ thống.",
          ],
          table: {
            caption: "Mục tiêu trải nghiệm và thành phần chính của từng trang.",
            head: ["Trang", "Mục tiêu UX", "Thành phần chính"],
            rows: [
              ["Heritage", "Xây dựng niềm tin và ấn tượng thương hiệu", "Banner, câu chuyện lịch sử, lời kêu gọi hành động"],
              ["Collections", "Tối ưu khả năng tìm kiếm", "Lưới sản phẩm, bộ lọc theo danh mục, chất liệu và giá"],
              ["Product Detail", "Hỗ trợ quyết định mua", "Ảnh độ phân giải cao, thông số vàng – bạc, giá động, nút thêm vào giỏ"],
              ["Cart", "Kiểm tra đơn trước khi thanh toán", "Danh sách sản phẩm, điều chỉnh số lượng, tạm tính"],
              ["Confirm Order", "Hoàn tất giao dịch an toàn", "Thông tin giao hàng, voucher, điểm thành viên, nút PayPal"],
              ["Account", "Cá nhân hoá trải nghiệm", "Hồ sơ, hạng thành viên, lịch sử đơn, hoá đơn điện tử"],
              ["Appointment", "Tư vấn riêng (bespoke)", "Biểu mẫu đặt lịch, chọn khung giờ và loại dịch vụ"],
              ["Policies", "Minh bạch và tuân thủ", "Quyền riêng tư, bảo hành, đổi trả"],
            ],
          },
          wide: true,
          figures: [
            { src: "r12", caption: "Sơ đồ điều hướng phía khách hàng." },
            { src: "r21", caption: "Cấu trúc mô-đun API phía máy chủ." },
          ],
        },
        {
          title: "Công nghệ sử dụng",
          subsections: [
            {
              title: "Giao diện",
              body: "Ứng dụng một trang (SPA) viết bằng React 19 và TypeScript; TypeScript định nghĩa kiểu cho Product và Order, giúp phát hiện lỗi ngay khi phát triển trong luồng thanh toán phức tạp. Zustand quản lý trạng thái toàn cục (giỏ hàng, phiên đăng nhập, cấu hình) mà không cần truyền props qua nhiều tầng. Tailwind CSS đảm nhận bố cục, Material UI cung cấp bảng dữ liệu và biểu mẫu (React, 2024; Zustand, 2024).",
            },
            {
              title: "Máy chủ",
              body: "Node.js và Express xây dựng API REST chia theo mô-đun (Auth, Products, Orders, Appointments), giúp thêm tính năng như hệ thống voucher mà không ảnh hưởng phần khác. JWT duy trì phiên; bcrypt băm mật khẩu quản trị; middleware áp dụng CORS, giới hạn tần suất chống brute-force và lớp kiểm tra khoá API dành riêng cho quản trị viên. Điểm kỹ thuật then chốt là xác minh trạng thái thanh toán cuối cùng bằng API PayPal phía máy chủ (Node.js Foundation, 2024; PayPal Developer, 2024).",
            },
            {
              title: "Cơ sở dữ liệu",
              body: "MongoDB Atlas lưu dữ liệu dạng tài liệu, phù hợp với thuộc tính biến thiên của trang sức mà không cần migration phức tạp như SQL truyền thống. Mongoose ràng buộc trường bắt buộc, định dạng email và tính duy nhất của mã voucher, mã sản phẩm; hook tự tính lại điểm thưởng và tổng chi tiêu sau mỗi đơn thành công; chỉ mục được đặt cho số đơn và email khách hàng (MongoDB, 2024).",
            },
            {
              title: "Lý do lựa chọn",
              body: "Một ngôn ngữ JavaScript xuyên suốt giao diện và máy chủ giúp dùng chung logic như hàm kiểm tra dữ liệu và giảm chi phí chuyển ngữ cảnh. Kiến trúc NoSQL của MongoDB cùng mô hình xử lý bất đồng bộ của Node.js giúp hệ thống sẵn sàng mở rộng khi lượng truy cập tăng vào mùa khuyến mãi.",
            },
          ],
        },
        {
          title: "Vấn đề pháp lý, đạo đức và xã hội",
          subsections: [
            {
              title: "Tuân thủ GDPR",
              body: "Hệ thống thiết kế theo nguyên tắc Privacy by Design: chỉ thu thập dữ liệu cần cho giao dịch (email, số điện thoại, địa chỉ) và nêu rõ mục đích trong trang Chính sách quyền riêng tư, phù hợp nguyên tắc tối thiểu hoá dữ liệu tại Điều 5 GDPR. Khách hàng có thể xem, sửa thông tin và yêu cầu xoá lịch sử tư vấn. Để tuân thủ trọn vẹn, cần bổ sung xuất dữ liệu dạng máy đọc được và sổ ghi chép hoạt động xử lý (European Parliament and Council, 2016).",
            },
            {
              title: "Đạo đức thiết kế",
              body: "Giao diện tránh dark pattern: huỷ lịch hẹn và xoá giỏ hàng đều dễ thực hiện, tôn trọng quyền tự quyết của khách. Điểm thưởng và voucher được tính ở backend để bảo đảm công bằng. Xác minh thanh toán phía máy chủ vừa là giải pháp kỹ thuật vừa là cam kết bảo vệ tài chính khách hàng (Gotterbarn, Miller and Rogerson, 1997; OWASP Foundation, 2021).",
            },
          ],
        },
        {
          title: "Minh chứng giao diện — trải nghiệm khách hàng",
          wide: true,
          figures: [
            { src: "r41", caption: "Trang Heritage: \"The Art of Preservation\"." },
            { src: "r42", caption: "Heritage: phần \"The Dialogue of Fire & Gold\"." },
            { src: "r43", caption: "Heritage: dòng thời gian \"The Chronicle\"." },
            { src: "r44", caption: "Heritage: \"The Curated Archive\"." },
            { src: "r45", caption: "Heritage: cam kết chất liệu và nguồn gốc." },
            { src: "r51", caption: "Trang Collections với bộ lọc danh mục." },
            { src: "r6b1", caption: "Lọc sản phẩm bằng thanh tìm kiếm." },
            { src: "r81", caption: "Thẻ sản phẩm được đánh dấu hàng mới." },
            { src: "r91", caption: "Thẻ sản phẩm có giảm giá." },
            { src: "r101", caption: "Trang chi tiết sản phẩm: thông số, chất liệu và giá." },
            { src: "r111", caption: "Giỏ hàng với sản phẩm đã chọn." },
            { src: "r131", caption: "Nhập voucher và điểm thành viên khi thanh toán." },
            { src: "r141", caption: "Tổng tiền sau khi cộng phí và trừ ưu đãi." },
            { src: "r151", caption: "Xác nhận đơn sau khi thanh toán qua PayPal." },
            { src: "r161", caption: "Trang Valuation: giá vàng – bạc theo thị trường." },
            { src: "r171", caption: "Trang đặt lịch tư vấn riêng." },
            { src: "r172", caption: "Biểu mẫu chọn dịch vụ và khung giờ." },
            { src: "r181", caption: "Đăng nhập khách hàng bằng Google." },
            { src: "r261", caption: "Concierge Liaison: gửi yêu cầu hỗ trợ." },
            { src: "r601", caption: "Trang chính sách: quyền riêng tư, bảo hành, đổi trả." },
          ],
        },
        {
          title: "Minh chứng giao diện — chế độ quản trị",
          wide: true,
          figures: [
            { src: "r271", caption: "Đăng nhập quản trị." },
            { src: "r28a1", caption: "Thông báo lỗi khi xác thực bị từ chối." },
            { src: "r291", caption: "Quản lý bộ sưu tập." },
            { src: "r301", caption: "Chỉnh sửa thông tin và thông số sản phẩm." },
            { src: "r311", caption: "Xác nhận xoá sản phẩm." },
            { src: "r32a1", caption: "Thêm sản phẩm mới, ảnh tải lên Cloudinary." },
            { src: "r331", caption: "Sản phẩm mới xuất hiện ở trang Collections." },
            { src: "r531", caption: "Cấu hình hệ thống: tạo voucher." },
            { src: "r541", caption: "Bật / tắt voucher." },
          ],
        },
        {
          title: "Minh chứng giao diện — thiết bị di động",
          note: "Hệ thống thiết kế theo hướng mobile-first với thanh điều hướng cố định ở đáy để thao tác bằng một tay.",
          figures: [
            { src: "r611", caption: "Trang chủ (The Story) trên điện thoại." },
            { src: "r621", caption: "Trang Shop (Collections)." },
            { src: "r631", caption: "Trang Valuation." },
            { src: "r651", caption: "Giỏ hàng." },
            { src: "r851", caption: "Xem sản phẩm." },
            { src: "r861", caption: "Chọn số lượng sản phẩm." },
            { src: "r841", caption: "Thanh toán thành công." },
            { src: "r821", caption: "Đặt lịch tư vấn." },
            { src: "r831", caption: "Đặt lịch thành công." },
            { src: "r711", caption: "Quản lý bộ sưu tập ở chế độ quản trị." },
          ],
        },
        {
          title: "Kiểm thử và đánh giá",
          paragraphs: [
            "Chiến lược kiểm thử gồm hai phương pháp: kiểm thử tĩnh bằng ESLint và kiểm tra kiểu TypeScript ở giao diện, và kiểm thử thủ công luồng nghiệp vụ mô phỏng hành vi người dùng từ tìm sản phẩm, thanh toán tới dịch vụ sau bán hàng.",
          ],
          table: {
            caption: "Các ca kiểm thử chính.",
            head: ["Mã", "Kịch bản", "Kết quả mong đợi", "Trạng thái"],
            rows: [
              ["HWJ01", "Đăng nhập qua Google OAuth", "Tạo hoặc cập nhật hồ sơ khách hàng", "Đạt"],
              ["HWJ02", "Cập nhật hồ sơ", "Lưu họ tên, số điện thoại, địa chỉ vào MongoDB", "Đạt"],
              ["HWJ03", "Thanh toán khi hồ sơ chưa đủ", "Chặn thanh toán", "Đạt"],
              ["HWJ04", "Tạo đơn PayPal hợp lệ", "Đơn lưu với paymentStatus: \"paid\"", "Đạt"],
              ["HWJ05", "Giả lập lệch số tiền thanh toán", "Backend từ chối đơn khác số tiền PayPal", "Đạt"],
              ["HWJ06", "Áp dụng voucher", "Giảm đúng theo cấu hình voucher", "Đạt"],
              ["HWJ07", "Truy cập API quản trị trái phép", "Trả về 403 Forbidden", "Đạt"],
              ["HWJ08", "CRUD sản phẩm", "Thêm, sửa, xoá và đồng bộ ảnh lên Cloudinary", "Đạt"],
              ["HWJ09", "Đổi trạng thái đơn", "Khách thấy trạng thái mới nhất", "Đạt"],
              ["HWJ10", "Đặt lịch tư vấn", "Lưu phiếu hẹn với trạng thái Pending", "Đạt"],
              ["HWJ11", "Xếp hạng thành viên động", "Hạng tự cập nhật khi đạt ngưỡng chi tiêu", "Đạt"],
              ["HWJ12", "Định giá kim loại", "Hiển thị giá tham chiếu theo thị trường", "Đạt"],
              ["HWJ13", "Kiểm thử responsive", "Hiển thị tốt trên điện thoại và máy tính bảng", "Đạt"],
              ["HWJ14", "Thêm hàng hết kho vào giỏ", "Nút bị vô hiệu hoặc báo hết hàng", "Đạt"],
              ["HWJ15", "Đổi số lượng trong giỏ", "Tạm tính cập nhật tức thì", "Đạt"],
            ],
          },
        },
        {
          title: "Hạn chế và hướng phát triển",
          list: [
            "Tự động hoá kiểm thử: chuyển từ kiểm thử thủ công sang kiểm thử đơn vị, tích hợp và đầu–cuối với Jest hoặc Cypress.",
            "SEO và hiệu năng: chuyển sang Next.js để kết xuất phía máy chủ, giúp sản phẩm dễ được công cụ tìm kiếm lập chỉ mục.",
            "Tích hợp AI: chatbot tư vấn trang sức theo sở thích khách hàng và tự phân loại yêu cầu hỗ trợ cho quản trị viên.",
            "Giao diện: tiếp tục tối ưu cho thiết bị di động và người dùng ở mọi độ tuổi.",
          ],
        },
        {
          title: "Phản tư",
          paragraphs: [
            "Về kỹ thuật, dự án giúp hiểu cách nối các thành phần rời rạc của MERN thành một hệ thống thống nhất, từ thiết kế schema linh hoạt trên MongoDB tới tối ưu giao diện với React 19; quản lý trạng thái bằng Zustand thay đổi cách tiếp cận bài toán hiệu năng của SPA.",
            "Thách thức lớn nhất là tích hợp PayPal SDK và xử lý xác minh phía máy chủ để bảo đảm chính xác tài chính, bên cạnh đồng bộ giỏ hàng, xử lý phản hồi lỗi từ API và cân bằng thẩm mỹ với tốc độ tải khi dùng ảnh chất lượng cao qua Cloudinary.",
            "Bài học lớn nhất là thiết kế cấu trúc dữ liệu đúng từ đầu, và các lớp phòng thủ quan trọng phải nằm ở backend thay vì dựa vào phía khách.",
          ],
        },
        {
          title: "Kết luận",
          paragraphs: [
            "HWJ đạt mục tiêu xây dựng một nền tảng thương mại điện tử chuyên biệt cho trang sức cao cấp. Kiến trúc MERN giải quyết được ba yêu cầu: trải nghiệm sang trọng, quản lý dữ liệu linh hoạt và an toàn giao dịch tài chính. Dự án thể hiện sự kết hợp giữa kỹ năng lập trình full-stack, chuẩn thiết kế UI/UX và quy trình nghiệp vụ thực tế.",
          ],
        },
      ],
      references: [
        "Cloudinary (2024) Cloudinary Image Management for Web Developers. Available at: https://cloudinary.com/documentation",
        "European Parliament and Council (2016) Regulation (EU) 2016/679 (General Data Protection Regulation). Available at: https://gdpr-info.eu/",
        "Gotterbarn, D., Miller, K. and Rogerson, S. (1997) Software Engineering Code of Ethics. Communications of the ACM, 40(11), pp. 110–118.",
        "MongoDB (2024) What is MongoDB? Available at: https://www.mongodb.com/what-is-mongodb",
        "Node.js Foundation (2024) Node.js v20.x Documentation. Available at: https://nodejs.org/docs/latest/api/",
        "OWASP Foundation (2021) OWASP Top 10:2021. Available at: https://owasp.org/www-project-top-ten/",
        "PayPal Developer (2024) Integration Guide for PayPal Checkout. Available at: https://developer.paypal.com/docs/checkout/",
        "React Team (2024) React 19. Available at: https://react.dev/blog/2024/04/25/react-19",
        "Zustand (2024) Getting started. Available at: https://docs.pmnd.rs/zustand/getting-started/introduction",
      ],
    },
  },
  {
    id: "minh-oi-media",
    title: "Mình Ơi Media",
    tagline: "Website studio phóng sự cưới — bảng giá, portfolio và luồng liên hệ.",
    kind: "client",
    startedAt: "2026-03",
    period: "03–04/2026",
    role: "Thiết kế & lập trình toàn phần",
    url: "https://minhoimedia.digital",
    urlLabel: "minhoimedia.digital",
    repo: "https://github.com/Hugo-huy2004/job_01_MinhOi_Media_studio",
    stack: ["HTML", "CSS", "JavaScript", "Responsive"],
    techNote:
      "HTML, CSS và JavaScript thuần, không khung nào cả. Một trang giới thiệu năm gói dịch vụ không cần đến React; bỏ khung đi thì trang nhẹ, mở nhanh trên mạng 4G, và khách hàng tự sửa được chữ trong tệp mà không cần gọi cho ai.",
    summary:
      "Khách chọn studio cưới bằng cách mở ba trang cùng lúc. Trang nào bắt nhắn tin mới nói giá, trang đó bị đóng trước. Toàn bộ thiết kế ở đây đi ra từ một quan sát đó.",
    highlights: [
      {
        title: "Khách hỏi giá trước khi hỏi tên",
        body:
          "Ngành cưới quen giấu giá để ép khách liên hệ. Ở đây năm gói dịch vụ nằm ngay trên đường đi, mỗi gói liệt kê đủ thứ khách nhận được — người đọc tự loại mình ra hoặc tự thấy mình hợp, trước khi ai phải trả lời tin nhắn nào.",
      },
      {
        title: "Ảnh nói trước, chữ nói sau",
        body:
          "Màn hình đầu tiên là một tấm ảnh cưới khổ lớn, không phải khẩu hiệu. Với một studio, tấm ảnh đầu tiên chính là toàn bộ phần chứng minh năng lực; mọi câu chữ đứng sau đó chỉ làm nhiệm vụ giải thích.",
      },
      {
        title: "Màn hình dọc là mặc định",
        body:
          "Gần như ai cũng xem trang này trên điện thoại, trong lúc nhắn tin cho nhau chọn studio. Bảng giá vì thế xếp lại thành một cột, không có bảng ngang nào bắt kéo qua kéo lại.",
      },
      {
        title: "Và không cần đến một khung nào",
        body:
          "HTML, CSS, JavaScript thuần. Một trang giới thiệu năm gói không cần React; bỏ khung đi thì trang nhẹ, mở nhanh trên 4G, và chính chủ studio sửa được chữ trong tệp mà không phải gọi cho ai.",
      },
    ],
    closing:
      "Dự án làm trực tiếp với khách, từ buổi trao đổi yêu cầu tới lúc bàn giao. Thứ khách giữ lại được sau đó là một trang họ tự chăm được.",
    shots: [
      { src: "home", caption: "Trang chủ — ảnh khổ lớn dẫn trước, thương hiệu đè lên." },
      { src: "bang-gia", caption: "Bảng giá năm gói, liệt kê rõ thứ khách nhận được." },
      { src: "goi-dich-vu", caption: "Từng gói liệt kê đủ thứ khách nhận được." },
    ],
  },
  {
    id: "l3go-coffee",
    title: "L3GO Coffee",
    tagline: "Website quán cà phê — thực đơn 68 món, chọn theo tâm trạng.",
    kind: "personal",
    startedAt: "2026-05",
    period: "2026",
    role: "Thiết kế UI/UX",
    stack: ["React", "Tailwind", "Responsive"],
    techNote:
      "React và Tailwind. Phần mình đảm nhận là giao diện và trải nghiệm: hệ thống màu, nhịp chữ, luồng xem thực đơn và cách ảnh không gian được cắt. Phần dựng dữ liệu và triển khai do Jason Phan lo.",
    // Làm cùng Jason Phan: mình phụ trách UI/UX, phần backend không thuộc mình.
    partner: "Jason Phan",
    url: "https://legocoffee.hwagfu.dev",
    urlLabel: "legocoffee.hwagfu.dev",
    summary:
      "Một quán ba tầng ở Cần Thơ, cầu thang xoắn và tường gạch kính màu. Người ta chọn quán bằng chỗ ngồi chứ không bằng vị cà phê — nên trang web phải cho thấy không gian trước khi khách quyết định đi.",
    highlights: [
      {
        title: "Không gian mới là sản phẩm",
        body:
          "Ảnh cầu thang xoắn, tường gạch kính và mặt lưới đèn đêm được để khổ lớn, không băm nhỏ thành thư viện ảnh. Người đọc cần cảm được chỗ ngồi của mình ở đâu trước khi quan tâm quán bán gì.",
      },
      {
        title: "Thực đơn dài, nhưng không ai đọc hết",
        body:
          "Sáu mươi tám món, và không ai đọc hết một bảng cà phê – trà – đá xay. Bộ lọc vì thế xếp theo cảm giác người ta đang muốn: cần tỉnh, muốn dịu lòng, ngồi lâu với bạn. Chọn theo tâm trạng nhanh hơn chọn theo danh mục.",
      },
      {
        title: "Phần mình làm, phần bạn ấy làm",
        body:
          "Dự án làm cùng Jason Phan. Phần mình đảm nhận là UI/UX: hệ thống màu, nhịp chữ, luồng xem thực đơn và cách cắt ảnh không gian. Phần dựng dữ liệu và triển khai thuộc về bạn ấy — ranh giới rõ từ đầu nên không ai giẫm chân ai.",
      },
    ],
    closing:
      "Một dự án ngắn, nhưng là lần thấy rõ nhất rằng phần khó của thực đơn không phải bày món, mà là giúp người ta thôi phân vân.",
    note:
      "Bài viết chi tiết về dự án nằm trong thư viện của Jason Phan: hwagfu.dev/en/library/projects/l3go-coffee",
    shots: [
      { src: "home", caption: "Trang chủ — \"Món đúng mood. Gốc đúng gu.\"" },
      { src: "thuc-don", caption: "Thực đơn lọc theo tâm trạng, không theo danh mục." },
      { src: "khong-gian", caption: "Trang không gian — quán ba tầng, cầu thang xoắn." },
    ],
  },
];

// Một dòng thời gian cho cả site (trang chủ, /project, "Chặng tiếp theo"): cũ nhất trước, theo `startedAt`.
projects.sort((a, b) => a.startedAt.localeCompare(b.startedAt));

/** Ảnh nào cũng ở một chỗ, nên đường dẫn dựng bằng công thức. */
export const shotUrl = (projectId, name) => `/project-screenshots/${projectId}/${name}${name.includes('.') ? '' : '.webp'}`;

export const findProject = (id) => projects.find((p) => p.id === id);
