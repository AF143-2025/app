# دليل تشغيل وبناء تطبيق أندرويد (APK) - متجر سما الخضراء

تم تجهيز وبرمجة تطبيق أندرويد أصلي متكامل (Native Android Application) في المجلد [`android/`](file:///c:/Users/amera/Documents/antigravity/cool-nobel/android) يربط واجهة وتطبيق متجر سما الخضراء بنظام الأندرويد بكفاءة وسرعة فائقة.

---

## 📱 مميزات تطبيق الأندرويد المدمج

1. **شاشة افتتاحية (Splash Screen)**: تظهر شعار "سما الخضراء" الرسمي باللون الزمردي المعتمد فور النقر على أيقونة التطبيق.
2. **أيقونات التطبيق بجميع المقاسات (Adaptive & Mipmap Icons)**: متوافقة مع جميع إصدارات أندرويد القديمة والحديثة (Android 7 حتى Android 14+).
3. **تحديث بالسحب (Swipe-to-Refresh)**: إمكانية سحب الشاشة لأسفل لتحديث المنتجات والأسعار والبيانات فورياً.
4. **دعم كامل لرفع الصور والملفات**: يدعم فتح الكاميرا أو معرض الصور لرفع صور الأجهزة في قسم الصيانة وإيصالات الدفع.
5. **شاشة انقطاع الإنترنت الذكية (Offline Fallback)**: شاشة مخصصة باللغة العربية مع زر "إعادة المحاولة" عند ضعف أو انقطاع الشبكة.
6. **زر الرجوع الذكي (Smart Back Button)**: عند الضغط على زر الرجوع في الهاتف يتم الرجوع للصفحة السابقة داخل المتجر بدلاً من إغلاق التطبيق.
7. **إدارة التنزيلات (Download Manager)**: دعم تحميل الفواتير والإيصالات بصيغة PDF مباشرة إلى مجلد التنزيلات بالهاتف.

---

## 🚀 طرق الحصول على ملف الـ APK وتثبيته

### الطريقة الأولى: البناء بنقرة واحدة عبر Android Studio (الموصى بها للمطورين)
1. قم بفتح برنامج **Android Studio**.
2. اختر **Open** ثم حدد المجلد:
   ```text
   c:\Users\amera\Documents\antigravity\cool-nobel\android
   ```
3. انتظر ثوانٍ حتى يقوم Android Studio بمزامنة ملفات Gradle تلقائياً.
4. من القائمة العلوية اضغط على:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. ستظهر لك رسالة تفيد بنجاح البناء مع زر **locate** للوصول لملف `app-debug.apk` فوراً ونقله إلى هاتفك!

---

### الطريقة الثانية: البناء السحابي التلقائي بدون برامج (GitHub Actions)
لقد قمنا بإعداد ملف أتمتة سحابي كامل في [`.github/workflows/build-apk.yml`](file:///c:/Users/amera/Documents/antigravity/cool-nobel/.github/workflows/build-apk.yml):
1. بمجرد رفع المشروع إلى حسابك في **GitHub** (عبر `git push`):
2. توجه إلى تبويب **Actions** في مستودع GitHub الخاص بك.
3. ستجد مهمة **Build Android APK** تعمل تلقائياً.
4. بعد اكتمال البناء (خلال دقيقة إلى دقيقتين)، ستجد ملف الـ APK جاهزاً للتحميل تحت قسم **Artifacts** باسم **Sama-AlKhadraa-Debug-APK**.

---

### الطريقة الثالثة: البناء عبر سطر الأوامر (Command Line)
إذا كان الـ Android SDK مثبتاً على جهازك:
1. انقر نقراً مزدوجاً على الملف:
   [`android/build-apk.bat`](file:///c:/Users/amera/Documents/antigravity/cool-nobel/android/build-apk.bat)
2. أو من الطرفية (Terminal):
   ```powershell
   cd android
   .\gradlew.bat assembleDebug
   ```
3. ستجد ملف الـ APK المولد في المسار:
   ```text
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

## 🌐 ضبط رابط السيرفر (Server URL)

لتغيير الرابط الذي يتصل به التطبيق (سواء كان رابط محلي أو دومين رسمي):
1. افتح الملف:
   [`android/app/src/main/res/values/strings.xml`](file:///c:/Users/amera/Documents/antigravity/cool-nobel/android/app/src/main/res/values/strings.xml)
2. عدل السطر التالي بالرابط الذي تريده:
   ```xml
   <string name="default_web_url">https://your-domain.com</string>
   ```

### لتشغيل نفق Cloudflare لمشاركة السيرفر مع الهاتف:
انقر نقراً مزدوجاً على الملف:
[`scripts/start-mobile-tunnel.bat`](file:///c:/Users/amera/Documents/antigravity/cool-nobel/scripts/start-mobile-tunnel.bat)
سيقوم بتوليد رابط آمن يبدأ بـ `https://*.trycloudflare.com` ليعمل التطبيق على أي هاتف متصل ببيانات الهاتف (4G/5G) أو أي شبكة Wi-Fi خارجية.
